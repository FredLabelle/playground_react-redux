const { stringify } = require('querystring');
const DataLoader = require('dataloader');
const uuid = require('uuid/v4');
const omit = require('lodash/omit');

const { Organization, InvestorProfile, Company, User, Deal, Ticket } = require('../models');
const UserService = require('./user');
const { gravatarPicture, generateInvitationEmailContent } = require('../lib/util');
const { sendEmail } = require('../lib/mailjet');
const { uploadFileFromUrl } = require('../lib/gcs');

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
        include: [{ model: InvestorProfile }, { model: Ticket }],
      });
      return investors.map(investor =>
        Object.assign({}, investor.toJSON(), omit(investor.InvestorProfile.toJSON(), 'id'), {
          pictureUrl: investor.picture.url,
          companyName: investor.InvestorProfile.corporationSettings.companyName,
          tickets: {
            count: investor.Tickets.length,
          },
        })
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
        to: input.investor.email,
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
        include: [{ model: Company }, { model: Ticket }],
      });
      return deals.map(deal =>
        Object.assign({}, deal.toJSON(), {
          company: deal.Company.toJSON(),
          tickets: {
            count: deal.Tickets.length,
            sum: {
              amount: deal.Tickets.reduce(
                (result, { amount }) => parseInt(amount.amount, 10) + result,
                0
              ),
              currency: deal.totalAmount.currency,
            },
          },
        })
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
      const env = process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : '';
      const name = `decks${env}/${deal.shortId}`;
      const newDeck = Object.assign({}, input.deck);
      newDeck.url = await uploadFileFromUrl(input.deck.url, name);
      await deal.update({ deck: newDeck });
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
        include: [
          {
            model: User,
            include: [{ model: InvestorProfile }],
          },
          {
            model: Deal,
            include: [{ model: Company }],
          },
        ],
      });
      return tickets.map(ticket =>
        Object.assign({}, ticket.toJSON(), {
          investor: Object.assign({}, ticket.User.toJSON(), ticket.User.InvestorProfile.toJSON(), {
            pictureUrl: ticket.User.picture.url,
            companyName: ticket.User.InvestorProfile.corporationSettings.companyName,
          }),
          deal: Object.assign({}, ticket.Deal.toJSON(), { company: ticket.Deal.Company.toJSON() }),
        })
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
