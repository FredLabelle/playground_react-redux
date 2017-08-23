import PropTypes from 'prop-types';
import { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

import { TicketPropType } from '../../lib/prop-types';
import InvestorCell from '../common/investor-cell';
import TicketsSumCell from '../common/tickets-sum-cell';
import UpsertTicketModal from '../common/upsert-ticket-modal';

const DealTicketsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

class DealTicketsListRow extends Component {
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
        <InvestorCell investor={ticket.investor} />
        <TicketsSumCell ticketsSum={{ sum: ticket.amount }} />
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
            deal={ticket.deal}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

const DealTicketsList = ({ tickets }) =>
  tickets.length
    ? <Table basic="very" celled>
        <DealTicketsListHeader />
        <Table.Body>
          {tickets.map(ticket => <DealTicketsListRow key={ticket.id} ticket={ticket} />)}
        </Table.Body>
      </Table>
    : null;
DealTicketsList.propTypes = { tickets: PropTypes.arrayOf(TicketPropType).isRequired };

export default DealTicketsList;
