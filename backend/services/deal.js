const uniqBy = require('lodash/uniqBy');
const omit = require('lodash/omit');

const { Deal, Company, DealCategory, Ticket, User, InvestorProfile } = require('../models');
const UserService = require('../services/user');
const { handleFilesUpdate } = require('../lib/util');

const DealService = {
  findById(id) {
    return Deal.findById(id);
  },
  findByShortId(shortId) {
    return Deal.findOne({
      where: { shortId },
      include: [
        { model: Company },
        { model: DealCategory },
        {
          model: Ticket,
          include: [
            {
              model: User,
              include: InvestorProfile,
            },
          ],
        },
      ],
    });
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
          ticketsSum: {
            count: deal.Tickets.length,
            sum: {
              amount: deal.Tickets.reduce(
                (result, { amount }) => parseInt(amount.amount, 10) + result,
                0,
              ),
              currency: deal.amountAllocatedToOrganization.currency,
            },
          },
          investorsCommited: deal.Tickets.reduce(
            (result, { userId }) => (result.includes(userId) ? result : [...result, userId]),
            [],
          ).length,
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async deal(user, shortId) {
    try {
      const deal = await DealService.findByShortId(shortId);
      if (user.organizationId !== deal.organizationId) {
        return null;
      }
      const ticketsSumCounts = deal.Tickets.reduce((result, { userId }) => {
        const count = result[userId] === undefined ? 1 : result[userId] + 1;
        return Object.assign(result, { [userId]: count });
      }, {});
      return Object.assign({}, deal.toJSON(), {
        company: deal.Company.toJSON(),
        category: deal.DealCategory.toJSON(),
        ticketsSum: {
          count: deal.Tickets.length,
          sum: {
            amount: deal.Tickets.reduce(
              (result, { amount }) => parseInt(amount.amount, 10) + result,
              0,
            ),
            currency: deal.amountAllocatedToOrganization.currency,
          },
        },
        investors: uniqBy(
          deal.Tickets.map(ticket =>
            Object.assign(UserService.toInvestor(ticket.User), {
              ticketsSum: { count: ticketsSumCounts[ticket.User.id] },
            }),
          ),
          'id',
        ),
        tickets: deal.Tickets.map(ticket =>
          Object.assign(
            {
              investor: UserService.toInvestor(ticket.User),
            },
            ticket.toJSON(),
          ),
        ),
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async upsert(user, input) {
    try {
      let deal = await DealService.findById(input.id);
      if (deal && user.organizationId !== deal.organizationId) {
        return null;
      }
      if (!deal) {
        const organization = await user.getOrganization();
        deal = await organization.createDeal(omit(input, 'deck'));
      }
      const deck = await handleFilesUpdate(deal.shortId, input, 'deck');
      if (deck) {
        Object.assign(input, { deck });
      }
      const result = await deal.update(input);
      return result.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = DealService;
