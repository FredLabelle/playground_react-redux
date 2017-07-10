const uniqBy = require('lodash/uniqBy');

const { Deal, Company, DealCategory, Ticket, User, InvestorProfile } = require('../models');
const UserService = require('../services/user');
const { uploadFileFromUrl, deleteFiles } = require('../lib/gcs');

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
  async create(user, input) {
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
  async update(user, input) {
    try {
      const deal = await DealService.findById(input.id);
      await deal.update(input);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async updateFiles(user, { resourceId, field, files }) {
    try {
      const deal = await DealService.findById(resourceId);
      if (user.organizationId !== deal.organizationId) {
        return false;
      }
      const fieldName = field.split('.').pop();
      const env = process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : '';
      const folderName = `${fieldName}${env}/${deal.shortId}`;
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
      }
      deal.set(field, newFiles);
      await deal.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = DealService;
