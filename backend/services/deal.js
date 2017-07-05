const uniqBy = require('lodash/uniqBy');

const { Deal, Company, DealCategory, Ticket, User, InvestorProfile } = require('../models');
const UserService = require('../services/user');

const DealService = {
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
            currency: deal.totalAmount.currency,
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
};

module.exports = DealService;
