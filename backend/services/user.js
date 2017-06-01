const { promisify } = require('util');
const { stringify } = require('querystring');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');

const { User } = require('../models');
const OrganizationService = require('./organization');
const { sendEmail } = require('../lib/mailjet');

const loader = new DataLoader(ids => Promise.all(ids.map(id => User.findById(id))));

const sign = promisify(jwt.sign);

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
  async signup(input) {
    try {
      const organization = await OrganizationService.findByShortId(input.organizationShortId);
      const canSignup = await UserService.canSignup(input.email, organization.id);
      if (!canSignup) {
        return { success: false };
      }
      const investor = Object.assign({ role: 'investor' }, input);
      const user = await organization.createUser(investor);
      await user.createInvestorProfile(investor);
      const token = await sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
      return { success: true, token };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
  passwordsMatch(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  },
  async login({ email, password, organizationShortId }) {
    try {
      const organization = await OrganizationService.findByShortId(organizationShortId);
      const user = await UserService.findByEmail(email, organization.id);
      const passwordsMatch = await UserService.passwordsMatch(password, user.password);
      if (!passwordsMatch) {
        return { success: false };
      }
      const token = await sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
      return { success: true, token };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
  logout() {
    return true;
  },
  async forgotPassword({ email, organizationShortId }) {
    try {
      const organization = await OrganizationService.findByShortId(organizationShortId);
      const user = await UserService.findByEmail(email, organization.id);
      if (!user) {
        return false;
      }
      const resetPasswordToken = uuid();
      // const profile = user.InvestorProfile;// await user.getInvestorProfile();
      await user.update({ resetPasswordToken });
      const queryString = stringify({ token: resetPasswordToken });
      const frontendUrl = process.env.FRONTEND_URL;
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
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async resetPassword(input) {
    try {
      const user = await UserService.findByResetPasswordToken(input.token);
      if (!user) {
        return { success: false };
      }
      const password = await bcrypt.hash(input.password, 10);
      await user.update({ password, resetPasswordToken: null });
      const token = await sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
      return { success: true, token };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
};

module.exports = UserService;
