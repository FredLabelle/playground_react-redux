const { Ticket, Investor, Deal, Company, DealCategory } = require('../models');

const TicketService = {
  async tickets(user) {
    try {
      const organization = await user.getOrganization();
      const tickets = await organization.getTickets({
        where: user.role === 'investor' && { investorId: user.id },
        include: [
          {
            model: Investor,
          },
          {
            model: Deal,
            include: [{ model: Company }, { model: DealCategory }],
          },
        ],
      });
      return tickets.map(ticket =>
        Object.assign({}, ticket.toJSON(), {
          investor: ticket.Investor,
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
  async upsert(admin, input) {
    try {
      let ticket = await Ticket.findById(input.id);
      if (!ticket) {
        const organization = await admin.getOrganization();
        ticket = await organization.createTicket(Object.assign({ status: 'accepted' }, input));
      }
      const result = await ticket.update(input);
      return result.toJSON();
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = TicketService;
