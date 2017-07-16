const { promisify } = require('util');
const { stringify } = require('querystring');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const defaultsDeep = require('lodash/defaultsDeep');

const { Investor, Organization, Ticket } = require('../models');
const { gravatarPicture, handleFilesUpdate } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const InvestorService = {
  idLoader() {
    return new DataLoader(ids => Promise.all(ids.map(id => Investor.findById(id))));
  },
  /* findById(id) {
    return this.loader.load(id);
  },*/
  findByEmail(email, organizationId) {
    return Investor.findOne({
      where: { email, organizationId },
    });
  },
  findByResetPasswordToken(resetPasswordToken) {
    return Investor.findOne({
      where: { resetPasswordToken },
    });
  },
  findByChangeEmailToken(changeEmailToken) {
    return Investor.findOne({
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
      const investor = await InvestorService.findByEmail(email, organization.id);
      if (!investor) {
        return null;
      }
      const password = await bcrypt.hash(input.password, 10);
      await investor.update(
        Object.assign(
          {
            name: input.name,
            password,
            status: 'joined',
          },
          input,
        ),
      );
      return sign({ userId: investor.id, role: investor.role }, process.env.FOREST_ENV_SECRET);
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
      const investor = await InvestorService.findByEmail(email, organizationId);
      if (!investor) {
        return null;
      }
      const passwordsMatch = await InvestorService.passwordsMatch(password, investor.password);
      if (!passwordsMatch) {
        return null;
      }
      return sign({ userId: investor.id, role: investor.role }, process.env.FOREST_ENV_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async forgotPassword({ email, organizationId }) {
    try {
      const organization = await Organization.findById(organizationId);
      const investor = await InvestorService.findByEmail(email, organization.id);
      if (!investor) {
        return false;
      }
      const resetPasswordToken = uuid();
      await investor.update({ resetPasswordToken });
      const queryString = stringify({ resetPasswordToken });
      const { shortId } = organization;
      const url = `${process.env.FRONTEND_URL}/organization/${shortId}/login?${queryString}`;
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: email,
        subject: 'Reset your password on InvestorX',
        templateId: 161024,
        vars: { firstName: investor.name.firstName, link: url },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async resetPassword(input) {
    try {
      const investor = await InvestorService.findByResetPasswordToken(input.token);
      if (!investor) {
        return null;
      }
      const password = await bcrypt.hash(input.password, 10);
      await investor.update({ password, status: 'joined', resetPasswordToken: null });
      return sign({ userId: investor.id, role: investor.role }, process.env.FOREST_ENV_SECRET);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async changeEmail(investor, input) {
    try {
      const passwordsMatch = await InvestorService.passwordsMatch(
        input.password,
        investor.password,
      );
      if (!passwordsMatch) {
        return false;
      }
      const changeEmailToken = await sign({ email: input.email }, process.env.FOREST_ENV_SECRET);
      await investor.update({ changeEmailToken });
      const queryString = stringify({ changeEmailToken });
      const url = `${process.env.BACKEND_URL}/change-email?${queryString}`;
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: input.email,
        subject: 'Change your email on InvestorX',
        templateId: 173370,
        vars: { firstName: investor.name.firstName, link: url },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async changePassword(investor, input) {
    try {
      const passwordsMatch = await InvestorService.passwordsMatch(
        input.currentPassword,
        investor.password,
      );
      if (!passwordsMatch) {
        return false;
      }
      const password = await bcrypt.hash(input.password, 10);
      await investor.update({ password });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async investor(investor) {
    try {
      if (!investor) {
        return null;
      }
      return InvestorService.findByEmail(investor.email, investor.organizationId);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async invitationStatus(input) {
    try {
      const investor = await InvestorService.findByEmail(input.email, input.organizationId);
      if (investor && investor.role !== 'investor') {
        return 'error';
      }
      if (investor) {
        return investor.status;
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
      let investor = await Investor.findById(input.id);
      if (!investor) {
        const organization = await user.getOrganization();
        const invitationStatus = await InvestorService.invitationStatus({
          email: input.email,
          organizationId: organization.id,
        });
        if (invitationStatus !== 'invitable') {
          return null;
        }
        investor = await organization.createInvestor(input);
      }
      const [picture, idDocuments, incProof] = await Promise.all([
        handleFilesUpdate(user.shortId, input, 'picture'),
        handleFilesUpdate(user.shortId, input, 'individualSettings.idDocuments'),
        handleFilesUpdate(user.shortId, input, 'corporationSettings.incProof'),
      ]);
      if (picture) {
        if (!picture.length) {
          picture.push(gravatarPicture(user.email));
        }
        Object.assign(input, { picture });
      }
      const { individualSettings, corporationSettings } = investor.toJSON();
      // input lacks some fields in nested JSONB so we need to default to current values
      const update = defaultsDeep(input, { individualSettings }, { corporationSettings });
      if (idDocuments) {
        Object.assign(update.individualSettings, { idDocuments });
      }
      if (incProof) {
        Object.assign(update.corporationSettings, { incProof });
      }
      return investor.update(input);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async investors(admin) {
    try {
      const organization = await admin.getOrganization();
      const investors = await organization.getInvestors({
        include: [{ model: Ticket }],
      });
      return investors.map(investor =>
        Object.assign(investor, {
          ticketsSum: { count: investor.Tickets.length },
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = InvestorService;
