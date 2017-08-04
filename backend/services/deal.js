const uniqBy = require('lodash/uniqBy');
const omit = require('lodash/omit');

const { Deal, Company, DealCategory, Ticket, Investor } = require('../models');
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
          include: [{ model: Investor }],
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
            where: user.role === 'investor' && { investorId: user.id },
          },
        ],
      });
      const investorDealFilter = deal => {
        const hasTickets = deal.Tickets.length;
        return hasTickets;
        /* const noTickets = deal.Tickets.length === 0;
        const referenceClosingDate = moment(deal.referenceClosingDate, 'YYYY-MM-DD');
        const ongoing = !referenceClosingDate.isValid() || referenceClosingDate.isAfter(moment());
        return noTickets && ongoing; */
      };
      const filter = user.role === 'investor' ? investorDealFilter : () => true;
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
            (result, { investorId }) =>
              result.includes(investorId) ? result : [...result, investorId],
            [],
          ).length,
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async deal(admin, shortId) {
    try {
      const deal = await DealService.findByShortId(shortId);
      if (admin.organizationId !== deal.organizationId) {
        return null;
      }
      const ticketsSumCounts = deal.Tickets.reduce((result, { investorId }) => {
        const count = result[investorId] === undefined ? 1 : result[investorId] + 1;
        return Object.assign(result, { [investorId]: count });
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
            Object.assign(ticket.Investor, {
              ticketsSum: { count: ticketsSumCounts[ticket.Investor.id] },
            }),
          ),
          'id',
        ),
        tickets: deal.Tickets.map(ticket =>
          Object.assign(
            {
              investor: ticket.Investor,
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
  async upsert(admin, input) {
    try {
      let deal = await DealService.findById(input.id);
      if (deal && admin.organizationId !== deal.organizationId) {
        return null;
      }
      if (!deal) {
        const organization = await admin.getOrganization();
        deal = await organization.createDeal(omit(input, 'deck'));
      }
      const deck = await handleFilesUpdate(input.deck, `deals/deck/${deal.shortId}`);
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
