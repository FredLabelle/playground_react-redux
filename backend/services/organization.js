const { stringify } = require('querystring');
const { promisify } = require('util');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const omit = require('lodash/omit');

const {
  Organization,
  InvestorProfile,
  Company,
  User,
  Deal,
  Ticket,
  DealCategory,
} = require('../models');
const UserService = require('./user');
const { gravatarPicture, generateInvitationEmailContent } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');
const { uploadFileFromUrl } = require('../lib/gcs');

const sign = promisify(jwt.sign);

const OrganizationService = {
  shortIdLoader() {
    return new DataLoader(shortIds =>
      Promise.all(
        shortIds.map(shortId =>
          Organization.findOne({
            where: { shortId },
          }),
        ),
      ),
    );
  },
  findById(id) {
    return Organization.findById(id);
  },
  findByShortId(shortId) {
    return Organization.findOne({
      where: { shortId },
      include: [{ model: DealCategory }],
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
      const dealCategories = organization.DealCategories.map(dealCategory => dealCategory.toJSON());
      const orderSorter = ({ order: orderA }, { order: orderB }) => orderA - orderB;
      dealCategories.sort(orderSorter);
      return Object.assign({}, organization.toJSON(), { dealCategories });
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
  async updateDealCategories(user, input) {
    try {
      const organization = await user.getOrganization();
      const dealCategories = await organization.getDealCategories();
      const promises = input.map((inputDealCategory, index) => {
        const dealCategory = dealCategories.find(category => category.id === inputDealCategory.id);
        const values = Object.assign({ order: index }, omit(inputDealCategory, 'id'));
        if (dealCategory) {
          return dealCategory.update(values);
        }
        return organization.createDealCategory(values);
      });
      const updatedDealCategories = await Promise.all(promises);
      const dealCategoriesIds = updatedDealCategories.map(dealCategory => dealCategory.id);
      await DealCategory.destroy({
        where: { id: { $notIn: dealCategoriesIds } },
      });
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
        include: [{ model: InvestorProfile }, { model: Ticket }],
      });
      return investors.map(investor =>
        Object.assign({}, investor.toJSON(), omit(investor.InvestorProfile.toJSON(), 'id'), {
          pictureUrl: investor.picture[0].url,
          companyName: investor.InvestorProfile.corporationSettings.companyName,
          tickets: {
            count: investor.Tickets.length,
          },
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async createInvestor(user, input) {
    try {
      const organization = await user.getOrganization();
      const invitationStatus = await OrganizationService.invitationStatus(user, input.email);
      if (invitationStatus !== 'invitable') {
        return false;
      }
      const resetPasswordToken = uuid();
      const picture = [gravatarPicture(input.email)];
      const investor = Object.assign({ role: 'investor', picture, resetPasswordToken }, input);
      const newUser = await organization.createUser(investor);
      await newUser.createInvestorProfile(investor);
      const frontendUrl = process.env.FRONTEND_URL;
      const { shortId } = organization;
      const queryString = stringify({ resetPasswordToken });
      const url = `${frontendUrl}/organization/${shortId}/login?${queryString}`;
      const { subject, body } = generateInvitationEmailContent(
        organization.parametersSettings.invitationEmail,
        organization.name,
        newUser.name,
        url,
      );
      await sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: newUser.email,
        subject,
        templateId: 166944,
        vars: { content: body.replace(/\n/g, '<br />') },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async invitationStatus(user, input) {
    try {
      const organization = await user.getOrganization();
      const foundUser = await UserService.findByEmail(input, organization.id);
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
        await newUser.createInvestorProfile();
      }
      const backendUrl = process.env.BACKEND_URL;
      const payload = Object.assign({}, input.investor, {
        organizationShortId: organization.shortId,
      });
      const token = await sign(payload, process.env.FOREST_ENV_SECRET);
      const queryString = stringify({ token });
      const url = `${backendUrl}/signup?${queryString}`;
      const { subject, body } = generateInvitationEmailContent(
        input.invitationEmail,
        organization.name,
        input.investor.name,
        url,
      );
      await sendEmail({
        fromEmail: 'investorx@e-founders.com',
        fromName: 'InvestorX',
        to: input.investor.email,
        subject,
        templateId: 166944,
        vars: { content: body.replace(/\n/g, '<br />') },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async companies(user) {
    try {
      const organization = await user.getOrganization();
      const companies = await organization.getCompanies();
      return companies.map(company => company.toJSON());
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async upsertCompany(user, input) {
    try {
      const organization = await user.getOrganization();
      const company = await Company.findOne({
        where: { name: input.name },
      });
      const result = company
        ? await company.update(input)
        : await organization.createCompany(input);
      return result.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async deals(user) {
    try {
      const organization = await user.getOrganization();
      const deals = await organization.getDeals({
        include: [
          { model: Company },
          { model: DealCategory },
          {
            model: Ticket,
            required: false,
            where: user.role === 'investor' && { userId: user.id },
          },
        ],
      });
      const filter = user.role === 'investor' ? deal => deal.Tickets.length === 0 : () => true;
      return deals.filter(filter).map(deal =>
        Object.assign({}, deal.toJSON(), {
          company: deal.Company.toJSON(),
          category: deal.DealCategory.toJSON(),
          tickets: {
            count: deal.Tickets.length,
            sum: {
              amount: deal.Tickets.reduce(
                (result, { amount }) => parseInt(amount.amount, 10) + result,
                0,
              ),
              currency: deal.totalAmount.currency,
            },
          },
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async createDeal(user, input) {
    try {
      const organization = await user.getOrganization();
      const deal = await organization.createDeal(input);
      if (input.deck.length) {
        const env = process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : '';
        const folderName = `deck${env}/${deal.shortId}`;
        uploadFileFromUrl(input.deck[0].url, `${folderName}/0`).then(url => {
          const newDeck = [Object.assign({}, input.deck[0], { url })];
          deal.update({ deck: newDeck });
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async tickets(user) {
    try {
      const organization = await user.getOrganization();
      const tickets = await organization.getTickets({
        where: user.role === 'investor' && { userId: user.id },
        include: [
          {
            model: User,
            include: [{ model: InvestorProfile }],
          },
          {
            model: Deal,
            include: [{ model: Company }, { model: DealCategory }],
          },
        ],
      });
      return tickets.map(ticket =>
        Object.assign({}, ticket.toJSON(), {
          investor: Object.assign({}, ticket.User.toJSON(), ticket.User.InvestorProfile.toJSON(), {
            pictureUrl: ticket.User.picture[0].url,
            companyName: ticket.User.InvestorProfile.corporationSettings.companyName,
          }),
          deal: Object.assign({}, ticket.Deal.toJSON(), {
            company: ticket.Deal.Company.toJSON(),
            category: ticket.Deal.DealCategory.toJSON(),
          }),
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async createTicket(user, input) {
    try {
      const organization = await user.getOrganization();
      await organization.createTicket(input);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = OrganizationService;
