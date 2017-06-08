const { promisify } = require('util');
const { stringify } = require('querystring');
const { createHash } = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const defaultsDeep = require('lodash/defaultsDeep');

const { User } = require('../models');
const OrganizationService = require('../services/organization');
const { sendEmail } = require('../lib/mailjet');
const { uploadFileFromUrl, deleteFile } = require('../lib/gcs');

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
      const hash = createHash('md5').digest('hex');
      const picture = {
        name: '',
        url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
        image: true,
      };
      const investor = Object.assign({ role: 'investor', picture }, input);
      const user = await organization.createUser(investor);
      await user.createInvestorProfile(investor);
      return sign({ userId: user.id, role: user.role }, process.env.FOREST_ENV_SECRET);
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
      if (!user) {
        return null;
      }
      const passwordsMatch = await UserService.passwordsMatch(password, user.password);
      if (!passwordsMatch) {
        return null;
      }
      return sign({ userId: user.id, role: user.role }, process.env.FOREST_ENV_SECRET);
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
      const { shortId } = organization;
      const url = `${frontendUrl}/organization/${shortId}/login?${queryString}`;
      await sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: email,
        subject: 'Reset your password on InvestorX',
        templateId: 161024,
        vars: { firstName: user.name.firstName, link: url },
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
      return sign({ userId: user.id, role: user.role }, process.env.FOREST_ENV_SECRET);
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
      // input lacks some fields in nested JSONB so we need to default to current values
      const { individualSettings, corporationSettings } = investorProfile.toJSON();
      const update = defaultsDeep(input, { individualSettings }, { corporationSettings });
      await investorProfile.update(update);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async updateInvestorFile(user, { field, file }) {
    try {
      const folderName = field.split('.').pop();
      const env = process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : '';
      const name = `${folderName}s${env}/${user.shortId}`;
      const newFile = Object.assign({}, file);
      if (file.url) {
        newFile.url = await uploadFileFromUrl(file.url, name);
      } else {
        await deleteFile(name);
      }
      const investorProfile = await user.getInvestorProfile();
      investorProfile.set(field, newFile);
      await investorProfile.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async adminLogin(input, organization) {
    const user = await UserService.findByEmail(input.email, organization.id);
    if (!user) {
      const newUser = await organization.createUser(input);
      return sign({ userId: newUser.id, role: newUser.role }, process.env.FOREST_ENV_SECRET);
    }
    return sign({ userId: user.id, role: user.role }, process.env.FOREST_ENV_SECRET);
  },
};

module.exports = UserService;
