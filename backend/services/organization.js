const { stringify } = require('querystring');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');

const { Organization, InvestorProfile } = require('../models');
const UserService = require('./user');
const { gravatarPicture, generateInvitationEmailContent } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');

const OrganizationService = {
  shortIdLoader() {
    return new DataLoader(shortIds =>
      Promise.all(
        shortIds.map(shortId =>
          Organization.findOne({
            where: { shortId },
          })
        )
      )
    );
  },
  findById(id) {
    return Organization.findById(id);
  },
  findByShortId(shortId) {
    return Organization.findOne({
      where: { shortId },
    });
  },
  findByEmailDomain(emailDomain) {
    return Organization.findOne({
      where: {
        generalSettings: {
          $contains: { emailDomains: [emailDomain] },
        },
      },
    });
  },
  async organization(shortId) {
    try {
      const organization = await OrganizationService.findByShortId(shortId);
      return organization.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async update(user, input) {
    try {
      if (user.role !== 'admin') {
        return false;
      }
      const organization = await user.getOrganization();
      await organization.update(input);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async investors(user) {
    try {
      const organization = await user.getOrganization();
      const investors = await organization.getUsers({
        where: { role: 'investor' },
        include: [{ model: InvestorProfile }],
      });
      return investors.map(investor =>
        Object.assign({}, investor.toJSON(), investor.InvestorProfile.toJSON())
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async createInvestor(user, input) {
    try {
      const organization = await user.getOrganization();
      const canSignup = await UserService.canSignup(input.email, organization.id);
      if (!canSignup) {
        return false;
      }
      const resetPasswordToken = uuid();
      const picture = gravatarPicture(input.email);
      const investor = Object.assign({ role: 'investor', picture, resetPasswordToken }, input);
      const newUser = await organization.createUser(investor);
      await newUser.createInvestorProfile(investor);
      const frontendUrl = process.env.FRONTEND_URL;
      const { shortId } = organization;
      const queryString = stringify({ resetPasswordToken });
      const url = `${frontendUrl}/organization/${shortId}/login?${queryString}`;
      const { subject, body } = generateInvitationEmailContent(organization, newUser, url);
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: newUser.email,
        subject,
        templateId: 166944,
        vars: { content: body },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async inviteInvestor(user, input) {
    try {
      const organization = await user.getOrganization();
      const canSignup = await UserService.canSignup(input.investor.email, organization.id);
      if (!canSignup) {
        return false;
      }
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: input.email,
        subject: input.invitationEmail.subject,
        templateId: 166944,
        vars: { content: input.invitationEmail.body },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = OrganizationService;
