const { stringify } = require('querystring');
const bcrypt = require('bcrypt');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');

const { User } = require('../models');
const OrganizationService = require('./organization');
const { sendEmail } = require('../lib/mailjet');

const loader = new DataLoader(ids => Promise.all(ids.map(id => User.findById(id))));

const UserService = {
  findById(id) {
    return loader.load(id);
  },
  findByEmail(email, organizationId) {
    return User.findOne({
      where: { email, organizationId },
    });
  },
  findByResetPasswordToken(resetPasswordToken) {
    return User.findOne({
      where: { resetPasswordToken },
    });
  },
  async canSignup(email, organizationId) {
    const user = await UserService.findByEmail(email, organizationId);
    return user === null;
  },
  async signup(investor, organization) {
    const user = await organization.createUser(investor);
    await user.createInvestorProfile(investor);
    return user;
  },
  passwordsMatch(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  },
  async forgotPassword({ email, organizationShortId }) {
    try {
      const organization = await OrganizationService.findByShortId(organizationShortId);
      const user = await UserService.findByEmail(email, organization.id);
      if (!user) {
        return false;
      }
      const frontendUrl = process.env.FRONTEND_URL;
      const resetPasswordToken = uuid();
      // const profile = user.InvestorProfile;// await user.getInvestorProfile();
      await user.update({ resetPasswordToken });
      const queryString = stringify({ reset: resetPasswordToken });
      const url = `${frontendUrl}/organization/${organizationShortId}/login?${queryString}`;
      await sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: email,
        subject: 'Reset your password on InvestorX',
        templateId: 161024,
        vars: { firstName: user.firstName, link: url },
      });
      return true;
    }
    catch(error) {
      console.error(error);
      return false;
    }
  },
  async resetPassword(payload) {
    try {
      const user = await UserService.findByResetPasswordToken(payload.token);
      if (!user) {
        return false;
      }
      const password = await bcrypt.hash(payload.password, 10);
      await user.update({ password, resetPasswordToken: null });
      return true;
    }
    catch(error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = UserService;
