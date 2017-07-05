const { promisify } = require('util');
const { stringify } = require('querystring');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const defaultsDeep = require('lodash/defaultsDeep');
const omit = require('lodash/omit');

const { User, Organization, InvestorProfile } = require('../models');
const { gravatarPicture } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');
const { uploadFileFromUrl, deleteFiles } = require('../lib/gcs');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const UserService = {
  idLoader() {
    return new DataLoader(ids => Promise.all(ids.map(id => User.findById(id))));
  },
  /* findById(id) {
    return this.loader.load(id);
  },*/
  async findByEmail(email, organizationId) {
    const user = await User.findOne({
      where: { email, organizationId },
      include: [{ model: InvestorProfile /* , as: 'profile'*/ }],
    });
    if (!user) {
      return null;
    }
    const profile = user.role === 'investor' ? user.InvestorProfile.toJSON() : {};
    return Object.assign(user, omit(profile, 'id'));
  },
  toInvestor(user) {
    const investorProfile = omit(user.InvestorProfile.toJSON(), 'id');
    return Object.assign({}, user.toJSON(), investorProfile, {
      pictureUrl: user.picture[0].url,
      companyName: investorProfile.corporationSettings.companyName,
    });
  },
  findByResetPasswordToken(resetPasswordToken) {
    return User.findOne({
      where: { resetPasswordToken },
    });
  },
  findByChangeEmailToken(changeEmailToken) {
    return User.findOne({
      where: { changeEmailToken },
    });
  },
  async canSignup(email, organizationId) {
    const user = await UserService.findByEmail(email, organizationId);
    return user === null;
  },
  async signup(input) {
    try {
      const { email, organizationShortId } = await verify(
        input.token,
        process.env.FOREST_ENV_SECRET,
      );
      const organization = await Organization.findOne({
        where: { shortId: organizationShortId },
      });
      const user = await UserService.findByEmail(email, organization.id);
      if (!user) {
        return null;
      }
      const password = await bcrypt.hash(input.password, 10);
      await user.update({ name: input.name, password });
      await user.InvestorProfile.update(Object.assign({ status: 'joined' }, input));
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
      const organization = await Organization.findById(organizationId);
      const user = await UserService.findByEmail(email, organization.id);
      if (!user) {
        return false;
      }
      const resetPasswordToken = uuid();
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
  async changeEmail(user, input) {
    try {
      const passwordsMatch = await UserService.passwordsMatch(input.password, user.password);
      if (!passwordsMatch) {
        return false;
      }
      const changeEmailToken = await sign({ email: input.email }, process.env.FOREST_ENV_SECRET);
      await user.update({ changeEmailToken });
      const queryString = stringify({ token: changeEmailToken });
      const backendUrl = process.env.BACKEND_URL;
      const url = `${backendUrl}/change-email?${queryString}`;
      await sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: input.email,
        subject: 'Change your email on InvestorX',
        templateId: 173370,
        vars: { firstName: user.name.firstName, link: url },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async changePassword(user, input) {
    try {
      const passwordsMatch = await UserService.passwordsMatch(input.currentPassword, user.password);
      if (!passwordsMatch) {
        return false;
      }
      const password = await bcrypt.hash(input.password, 10);
      await user.update({ password });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async me(user) {
    try {
      if (!user) {
        return null;
      }
      return UserService.findByEmail(user.email, user.organizationId);
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
  async updateInvestorFiles(user, { field, files }) {
    try {
      const fieldName = field.split('.').pop();
      const env = process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : '';
      const folderName = `${fieldName}${env}/${user.shortId}`;
      const newFiles = files.map(file => Object.assign({}, file));
      if (files.length) {
        const promises = files.map((file, index) =>
          uploadFileFromUrl(file.url, `${folderName}/${index}`),
        );
        const urls = await Promise.all(promises);
        urls.forEach((url, index) => {
          newFiles[index].url = url;
        });
      } else {
        await deleteFiles(folderName);
        if (fieldName === 'picture') {
          newFiles.push(gravatarPicture(user.email));
        }
      }
      const record = fieldName === 'picture' ? user : await user.getInvestorProfile();
      record.set(field, newFiles);
      await record.save();
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
