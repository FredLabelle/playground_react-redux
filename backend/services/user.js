const { promisify } = require('util');
const { stringify } = require('querystring');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');

const { User } = require('../models');
const OrganizationService = require('../services/organization');
const { sendEmail } = require('../lib/mailjet');
const { uploadImageFromUrl } = require('../lib/gcs');

const sign = promisify(jwt.sign);

const UserService = {
  idLoader() {
    return new DataLoader(ids => Promise.all(ids.map(id => User.findById(id))));
  },
  /* findById(id) {
    return this.loader.load(id);
  },*/
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
      const organization = await OrganizationService.findById(input.organizationId);
      const canSignup = await UserService.canSignup(input.email, organization.id);
      if (!canSignup) {
        return null;
      }
      const investor = Object.assign({ role: 'investor' }, input);
      const user = await organization.createUser(investor);
      await user.createInvestorProfile(investor);
      return sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  passwordsMatch(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  },
  async login({ email, password, organizationId }) {
    try {
      const user = await UserService.findByEmail(email, organizationId);
      const passwordsMatch = await UserService.passwordsMatch(password, user.password);
      if (!passwordsMatch) {
        return null;
      }
      return sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  logout() {
    return true;
  },
  async forgotPassword({ email, organizationId }) {
    try {
      const organization = await OrganizationService.findById(organizationId);
      const user = await UserService.findByEmail(email, organization.id);
      if (!user) {
        return false;
      }
      const resetPasswordToken = uuid();
      // const profile = user.InvestorProfile;// await user.getInvestorProfile();
      await user.update({ resetPasswordToken });
      const queryString = stringify({ token: resetPasswordToken });
      const frontendUrl = process.env.FRONTEND_URL;
      const url = `${frontendUrl}/organization/${organization.shortId}/login?${queryString}`;
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
        return null;
      }
      const password = await bcrypt.hash(input.password, 10);
      await user.update({ password, resetPasswordToken: null });
      return sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async me(user) {
    try {
      const result = Object.assign({}, user.toJSON());
      if (user.role === 'admin') {
        //
      } else if (user.role === 'investor') {
        const investorProfile = await user.getInvestorProfile();
        Object.assign(result, investorProfile.toJSON());
      }
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async updateInvestor(user, input) {
    try {
      await user.update(input);
      const investorProfile = await user.getInvestorProfile();
      await investorProfile.update(input);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async uploadInvestorIdDocument(user, cdnUrl) {
    try {
      const env = process.env.NODE_ENV !== 'production' && `-${process.env.NODE_ENV}`;
      const name = `idDocuments${env}/${user.shortId}`;
      const idDocument = await uploadImageFromUrl(cdnUrl, name);
      const investorProfile = await user.getInvestorProfile();
      await investorProfile.update({ idDocument });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = UserService;
