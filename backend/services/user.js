const { promisify } = require('util');
const { stringify } = require('querystring');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const defaultsDeep = require('lodash/defaultsDeep');
const omit = require('lodash/omit');
const pick = require('lodash/pick');

const { User, Organization, InvestorProfile, Ticket } = require('../models');
const {
  gravatarPicture,
  generateInvitationEmailContent,
  handleFilesUpdate,
} = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');

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
  findByInvestorId(id) {
    return User.findById(id, {
      include: [{ model: InvestorProfile }],
    });
  },
  toInvestor(user) {
    const investorProfile = omit(user.InvestorProfile.toJSON(), 'id');
    return Object.assign({}, user.toJSON(), investorProfile);
  },
  findByResetPasswordToken(resetPasswordToken) {
    return User.findOne({
      where: { resetPasswordToken },
      include: [{ model: InvestorProfile }],
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
      const queryString = stringify({ resetPasswordToken });
      const { shortId } = organization;
      const url = `${process.env.FRONTEND_URL}/organization/${shortId}/login?${queryString}`;
      sendEmail({
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
      await user.InvestorProfile.update({ status: 'joined' });
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
      const queryString = stringify({ changeEmailToken });
      const url = `${process.env.BACKEND_URL}/change-email?${queryString}`;
      sendEmail({
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
  adminLoginAck() {
    return true;
  },
  async adminLogin(input, organization) {
    const user = await UserService.findByEmail(input.email, organization.id);
    if (!user) {
      const newUser = await organization.createUser(input);
      return sign({ userId: newUser.id, role: newUser.role }, process.env.FOREST_ENV_SECRET);
    }
    return sign({ userId: user.id, role: user.role }, process.env.FOREST_ENV_SECRET);
  },
  async investors(user) {
    try {
      const organization = await user.getOrganization();
      const investors = await organization.getUsers({
        where: { role: 'investor' },
        include: [{ model: InvestorProfile }, { model: Ticket }],
      });
      return investors.map(investor =>
        Object.assign(UserService.toInvestor(investor), {
          ticketsSum: { count: investor.Tickets.length },
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async upsertInvestor(user, input) {
    try {
      if (user.role !== 'admin' && user.id !== input.id) {
        return null;
      }
      let investor = await UserService.findByInvestorId(input.id);
      if (!investor) {
        const organization = await user.getOrganization();
        const invitationStatus = await UserService.invitationStatus({
          email: input.email,
          organizationId: organization.id,
        });
        if (invitationStatus !== 'invitable') {
          return null;
        }
        const picture = [gravatarPicture(input.email)];
        const investorInput = Object.assign({ role: 'investor', picture }, input);
        const newInvestor = await organization.createUser(investorInput);
        await newInvestor.createInvestorProfile(investorInput);
        investor = await UserService.findByInvestorId(newInvestor.id);
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
      const { individualSettings, corporationSettings } = investor.InvestorProfile.toJSON();
      // input lacks some fields in nested JSONB so we need to default to current values
      const update = defaultsDeep(input, { individualSettings }, { corporationSettings });
      if (idDocuments) {
        Object.assign(update.individualSettings, { idDocuments });
      }
      if (incProof) {
        Object.assign(update.corporationSettings, { incProof });
      }
      await Promise.all([investor.update(input), investor.InvestorProfile.update(update)]);
      const result = await UserService.findByInvestorId(investor.id);
      return UserService.toInvestor(result);
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async invitationStatus(input) {
    try {
      const foundUser = await UserService.findByEmail(input.email, input.organizationId);
      if (foundUser && foundUser.role !== 'investor') {
        return 'error';
      }
      if (foundUser) {
        return foundUser.status;
      }
      return 'invitable';
    } catch (error) {
      console.error(error);
      return 'error';
    }
  },
  async inviteInvestor(user, input) {
    try {
      const organization = await user.getOrganization();
      const foundUser = await UserService.findByEmail(input.investor.email, organization.id);
      if (!foundUser) {
        const picture = [gravatarPicture(input.investor.email)];
        const investor = Object.assign({ role: 'investor', picture }, input.investor);
        const newUser = await organization.createUser(investor);
        await newUser.createInvestorProfile({ status: 'invited' });
      }
      const investor = foundUser ? pick(foundUser, 'email', 'name') : input.investor;
      const payload = Object.assign({}, investor, {
        organizationShortId: organization.shortId,
      });
      const token = await sign(payload, process.env.FOREST_ENV_SECRET);
      const queryString = stringify({ token });
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
  async sendInvitation(user, input) {
    try {
      const organization = await user.getOrganization();
      const foundUser = await UserService.findByEmail(input.investor.email, organization.id);
      if (!foundUser) {
        return false;
      }
      const resetPasswordToken = uuid();
      foundUser.update({ resetPasswordToken });
      const { shortId } = organization;
      const queryString = stringify({ resetPasswordToken, invited: true });
      const { subject, beforeLink, afterLink } = generateInvitationEmailContent(
        input.invitationEmail,
        organization.generalSettings.name,
        foundUser.name,
      );
      sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: foundUser.email,
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

module.exports = UserService;
