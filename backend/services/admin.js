const { promisify } = require('util');
const { stringify } = require('querystring');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

const { Admin } = require('../models');
const InvestorService = require('./investor');
const { generateInvitationEmailContent } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');

const sign = promisify(jwt.sign);

const AdminService = {
  findByEmail(email, organizationId) {
    return Admin.findOne({
      where: { email, organizationId },
    });
  },
  loginAck(admin) {
    return admin !== null;
  },
  async login(input, organization) {
    const admin = await AdminService.findByEmail(input.email, organization.id);
    if (!admin) {
      const newAdmin = await organization.createAdmin(input);
      return sign({ userId: newAdmin.id, role: newAdmin.role }, process.env.FOREST_ENV_SECRET);
    }
    return sign({ userId: admin.id, role: admin.role }, process.env.FOREST_ENV_SECRET);
  },
  async adminUser(admin) {
    try {
      if (!admin) {
        return null;
      }
      const result = await AdminService.findByEmail(admin.email, admin.organizationId);
      return result && result.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async inviteInvestor(admin, input) {
    try {
      const organization = await admin.getOrganization();
      const investor = await InvestorService.findByEmail(input.investor.email, organization.id);
      if (investor && investor.resetPasswordToken) {
        return AdminService.sendInvitation(admin, input);
      }
      if (!investor) {
        const investorInput = Object.assign(input.investor, { status: 'invited' });
        await organization.createInvestor(investorInput);
      }
      const investorInput = investor ? pick(investor, 'email', 'name') : input.investor;
      const payload = Object.assign({}, investorInput, {
        organizationShortId: organization.shortId,
      });
      const token = await sign(payload, process.env.FOREST_ENV_SECRET);
      const queryString = stringify({ token });
      const { subject, beforeLink, afterLink } = generateInvitationEmailContent(
        input.invitationEmail,
        organization.generalSettings.name,
        investorInput.name,
      );
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: investorInput.email,
        subject,
        templateId: 166944,
        vars: {
          beforeLink: beforeLink.replace(/\n/g, '<br />'),
          linkText: `Join ${organization.generalSettings.name}`,
          link: `${process.env.BACKEND_URL}/signup?${queryString}`,
          afterLink: afterLink.replace(/\n/g, '<br />'),
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async sendInvitation(admin, input) {
    try {
      const organization = await admin.getOrganization();
      const investor = await InvestorService.findByEmail(input.investor.email, organization.id);
      if (!investor) {
        return false;
      }
      const resetPasswordToken = uuid();
      investor.update({ status: 'invited', resetPasswordToken });
      const { shortId } = organization;
      const queryString = stringify({ resetPasswordToken, invited: true });
      const { subject, beforeLink, afterLink } = generateInvitationEmailContent(
        input.invitationEmail,
        organization.generalSettings.name,
        investor.name,
      );
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: investor.email,
        subject,
        templateId: 166944,
        vars: {
          beforeLink: beforeLink.replace(/\n/g, '<br />'),
          linkText: `Join ${organization.generalSettings.name}`,
          link: `${process.env.FRONTEND_URL}/organization/${shortId}/login?${queryString}`,
          afterLink: afterLink.replace(/\n/g, '<br />'),
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = AdminService;
