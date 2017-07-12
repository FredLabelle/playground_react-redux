const { User, InvestorProfile, Deal, Company, DealCategory } = require('../models');
const UserService = require('./user');

const TicketService = {
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
          investor: UserService.toInvestor(ticket.User),
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
  async create(user, input) {
    try {
      const organization = await user.getOrganization();
      await organization.createTicket(Object.assign({ status: 'accepted' }, input));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = TicketService;
