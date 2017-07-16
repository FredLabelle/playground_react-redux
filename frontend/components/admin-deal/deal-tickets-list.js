import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { TicketPropType } from '../../lib/prop-types';
import InvestorCell from '../common/investor-cell';
import TicketsSumCell from '../common/tickets-sum-cell';

const DealTicketsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const DealTicketsListRow = ({ ticket }) =>
  <Table.Row>
    <InvestorCell investor={ticket.investor} />
    <TicketsSumCell ticketsSum={{ sum: ticket.amount }} />
  </Table.Row>;
DealTicketsListRow.propTypes = { ticket: TicketPropType.isRequired };

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
