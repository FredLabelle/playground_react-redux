const { promisify } = require('util');
const { stringify } = require('querystring');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const defaultsDeep = require('lodash/defaultsDeep');
const get = require('lodash/get');
const cloneDeep = require('lodash/cloneDeep');
const uniqBy = require('lodash/uniqBy');

const { User, Organization } = require('../models');
const { gravatarPicture, handleFilesUpdate } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const UserService = {
  idLoader() {
    return new DataLoader(ids => Promise.all(ids.map(id => User.findById(id))));
  },
  /* findById(id) {
    return this.loader.load(id);
  }, */
  findByShortId(shortId) {
    return User.findOne({
      where: { shortId },
    });
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
  findByChangeEmailToken(changeEmailToken) {
    return User.findOne({
      where: { changeEmailToken },
    });
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
      await user.update(
        Object.assign(input, {
          password,
          status: 'joined',
        }),
      );
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
  async forgotPassword({ email, organizationId }) {
    try {
      const organization = await Organization.findById(organizationId);
      const user = await UserService.findByEmail(email, organization.id);
      if (!user) {
        return false;
      }
      const resetPasswordToken = uuid();
      await user.update({ resetPasswordToken });
      const queryString = stringify({ resetPasswordToken });
      const { shortId } = organization;
      const url = `${process.env.FRONTEND_URL}/organization/${shortId}/login?${queryString}`;
      sendEmail({
        fromEmail: 'invoicex@e-founders.com',
        fromName: 'InvoiceX',
        to: email,
        subject: 'Reset your password on InvoiceX',
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
      await user.update({ password, status: 'joined', resetPasswordToken: null });
      return sign({ userId: user.id, role: user.role }, process.env.FOREST_ENV_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async changeEmail(user, input) {
    try {
      const passwordsMatch = await UserService.passwordsMatch(
        input.password,
        user.password,
      );
      if (!passwordsMatch) {
        return false;
      }
      const changeEmailToken = await sign({ email: input.email }, process.env.FOREST_ENV_SECRET);
      await user.update({ changeEmailToken });
      const queryString = stringify({ changeEmailToken });
      const url = `${process.env.BACKEND_URL}/change-email?${queryString}`;
      sendEmail({
        fromEmail: 'invoicex@e-founders.com',
        fromName: 'InvoiceX',
        to: input.email,
        subject: 'Change your email on InvoiceX',
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
      const passwordsMatch = await UserService.passwordsMatch(
        input.currentPassword,
        user.password,
      );
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
  async user(user) {
  try {
    if (!user) {
      return null;
    }
    const result = await UserService.findByEmail(user.email, user.organizationId);
    return result && result.toJSON();
  } catch (error) {
    console.error(error);
    return null;
  }
},
  async invitationStatus({ email, organizationId }) {
    try {
      const admin = await Admin.findOne({
        where: { email, organizationId },
      });
      if (admin) {
        return 'error';
      }
      const user = await UserService.findByEmail(email, organizationId);
      if (user) {
        return user.status;
      }
      return 'invitable';
    } catch (error) {
      console.error(error);
      return 'error';
    }
  },
  async upsert(user, input) {
    try {
      if (user.role !== 'admin' && user.id !== input.id) {
        return null;
      }
      let user = await User.findById(input.id);
      if (!user) {
        const organization = await user.getOrganization();
        const invitationStatus = await UserService.invitationStatus({
          email: input.email,
          organizationId: organization.id,
        });
        if (invitationStatus !== 'invitable') {
          return null;
        }
        const userFields = cloneDeep(input);
        userFields.picture = [];
        user = await organization.createUser(userFields);
      }
      const [picture, incProof] = await Promise.all([
        handleFilesUpdate(get(input, 'picture'), `users/picture/${user.shortId}`),
      ]);
      if (picture) {
        if (!picture.length) {
          picture.push(gravatarPicture(user.email));
        }
        Object.assign(input, { picture });
      }
      return user.update(input);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = UserService;
