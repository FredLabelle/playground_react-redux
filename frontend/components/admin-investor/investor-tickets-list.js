import PropTypes from 'prop-types';
import { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

import { TicketPropType } from '../../lib/prop-types';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';
import TicketsSumCell from '../common/tickets-sum-cell';
import UpsertTicketModal from '../common/upsert-ticket-modal';

const InvestorTicketsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Company</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Ticket</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

class InvestorTicketsListRow extends Component {
  static propTypes = { ticket: TicketPropType.isRequired };
  state = { upsertTicketModalOpen: false };
  onUpsertTicketModalClose = () => {
    this.setState({ upsertTicketModalOpen: false });
  };
  updateTicket = event => {
    event.preventDefault();
    this.setState({ upsertTicketModalOpen: true });
  };
  render() {
    const { ticket } = this.props;
    return (
      <Table.Row>
        <CompanyCell company={ticket.deal.company} />
        <DealCell deal={ticket.deal} />
        <TicketsSumCell ticketsSum={{ sum: ticket.amount }} createdAt={ticket.createdAt} />
        <Table.Cell style={{ textAlign: 'center' }}>
          <Button
            type="button"
            basic
            className="button-link"
            content="Edit"
            onClick={this.updateTicket}
          />
          <UpsertTicketModal
            open={this.state.upsertTicketModalOpen}
            onClose={this.onUpsertTicketModalClose}
            ticket={ticket}
            investor={ticket.investor}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

const InvestorTicketsList = ({ tickets }) =>
  tickets.length
    ? <Table basic="very" celled>
        <InvestorTicketsListHeader />
        <Table.Body>
          {tickets.map(ticket => <InvestorTicketsListRow key={ticket.id} ticket={ticket} />)}
        </Table.Body>
      </Table>
    : null;
InvestorTicketsList.propTypes = { tickets: PropTypes.arrayOf(TicketPropType).isRequired };

export default InvestorTicketsList;
