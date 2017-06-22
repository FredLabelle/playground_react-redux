import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { AmountPropType, DealPropType, InvestorPropType } from '../../lib/prop-types';
import { ticketsQuery } from '../../lib/queries';
import InvestorCell from '../common/investor-cell';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';
import TicketsCell from '../common/tickets-cell';

const TicketsListHeader = ({ admin }) =>
  <Table.Header>
    <Table.Row>
      {admin && <Table.HeaderCell>Investor</Table.HeaderCell>}
      <Table.HeaderCell>Company</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Ticket</Table.HeaderCell>
      {admin && <Table.HeaderCell>Status</Table.HeaderCell>}
      {admin && <Table.HeaderCell>Actions</Table.HeaderCell>}
    </Table.Row>
  </Table.Header>;
TicketsListHeader.propTypes = { admin: PropTypes.bool.isRequired };

const TicketPropType = PropTypes.shape({
  investor: InvestorPropType.isRequired,
  deal: DealPropType.isRequired,
  amount: AmountPropType.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
});

const TicketsListRow = ({ admin, ticket }) =>
  <Table.Row>
    {admin && <InvestorCell investor={ticket.investor} />}
    <CompanyCell company={ticket.deal.company} />
    <DealCell deal={ticket.deal} />
    <TicketsCell tickets={{ sum: ticket.amount }} />
    {admin &&
      <Table.Cell>
        <strong>Pending</strong><br />
        {moment(ticket.createdAt).format('DD/MM/YYYY')}
      </Table.Cell>}
    {admin &&
      <Table.Cell>
        Accept | Reject | Edit
      </Table.Cell>}
    <style jsx>{`
      strong {
        color: #FE9A76;
      }
    `}</style>
  </Table.Row>;
TicketsListRow.propTypes = {
  admin: PropTypes.bool.isRequired,
  ticket: TicketPropType.isRequired,
};

const TicketsList = ({ admin, tickets }) =>
  tickets.length
    ? <Table basic="very" celled>
        <TicketsListHeader admin={admin} />
        <Table.Body>
          {tickets.map(ticket => <TicketsListRow key={ticket.id} admin={admin} ticket={ticket} />)}
        </Table.Body>
      </Table>
    : null;
TicketsList.propTypes = {
  admin: PropTypes.bool.isRequired,
  tickets: PropTypes.arrayOf(TicketPropType),
};
TicketsList.defaultProps = { tickets: [] };

export default compose(
  connect(({ router }) => ({ router }), null, ({ router }, dispatchProps, ownProps) => (
    Object.assign({ admin: router.admin === '/admin' }, ownProps)
  )),
  graphql(ticketsQuery, {
    props: ({ data: { tickets } }) => ({
      tickets: tickets
        ? tickets.map(ticket => ({
            ...ticket,
            createdAt: new Date(ticket.createdAt),
          }))
        : [],
    }),
  }),
)(TicketsList);
