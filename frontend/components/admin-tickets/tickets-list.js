import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { AmountPropType, DealPropType, InvestorPropType } from '../../lib/prop-types';
import { ticketsQuery } from '../../lib/queries';
import InvestorCell from '../common/investor-cell';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';
import TicketsCell from '../common/tickets-cell';

const TicketsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investor</Table.HeaderCell>
      <Table.HeaderCell>Company</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Ticket</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const TicketPropType = PropTypes.shape({
  investor: InvestorPropType.isRequired,
  deal: DealPropType.isRequired,
  amount: AmountPropType.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
});

const TicketsListRow = ({ ticket }) =>
  <Table.Row>
    <InvestorCell investor={ticket.investor} />
    <CompanyCell company={ticket.deal.company} />
    <DealCell deal={ticket.deal} />
    <TicketsCell tickets={{ sum: ticket.amount }} />
    <Table.Cell>
      <strong>Pending</strong><br />
      {moment(ticket.createdAt).format('DD/MM/YYYY')}
    </Table.Cell>
    <Table.Cell textAlign="center">
      Accept | Reject | Edit
    </Table.Cell>
    <style jsx>{`
      strong {
        color: #FE9A76;
      }
    `}</style>
  </Table.Row>;
TicketsListRow.propTypes = { ticket: TicketPropType.isRequired };

const TicketsList = ({ tickets }) =>
  tickets.length
    ? <Table basic="very" celled>
        <TicketsListHeader />
        <Table.Body>
          {tickets.map(ticket => <TicketsListRow key={ticket.id} ticket={ticket} />)}
        </Table.Body>
      </Table>
    : null;
TicketsList.propTypes = { tickets: PropTypes.arrayOf(TicketPropType) };
TicketsList.defaultProps = { tickets: [] };

export default graphql(ticketsQuery, {
  props: ({ data: { tickets } }) => ({
    tickets: tickets
      ? tickets.map(ticket => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
        }))
      : [],
  }),
})(TicketsList);
