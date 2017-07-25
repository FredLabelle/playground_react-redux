import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Table, Button } from 'semantic-ui-react';
// import moment from 'moment';

import { TicketPropType } from '../../lib/prop-types';
import ticketsQuery from '../../graphql/queries/tickets.gql';
import InvestorCell from './investor-cell';
import CompanyCell from './company-cell';
import DealCell from './deal-cell';
import TicketsSumCell from './tickets-sum-cell';
import UpsertTicketModal from './upsert-ticket-modal';

const TicketsListHeader = ({ admin }) =>
  <Table.Header>
    <Table.Row>
      {admin && <Table.HeaderCell>Investor</Table.HeaderCell>}
      <Table.HeaderCell>Company</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Ticket</Table.HeaderCell>
      {/* admin && <Table.HeaderCell>Status</Table.HeaderCell> */}
      {admin && <Table.HeaderCell>Actions</Table.HeaderCell>}
    </Table.Row>
  </Table.Header>;
TicketsListHeader.propTypes = { admin: PropTypes.bool.isRequired };

class TicketsListRow extends Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    ticket: TicketPropType.isRequired,
  };
  state = { upsertTicketModalOpen: false };
  onUpsertTicketModalClose = () => {
    this.setState({ upsertTicketModalOpen: false });
  };
  updateTicket = event => {
    event.preventDefault();
    this.setState({ upsertTicketModalOpen: true });
  };
  render() {
    const { admin, ticket } = this.props;
    return (
      <Table.Row>
        {admin && <InvestorCell investor={ticket.investor} />}
        <CompanyCell company={ticket.deal.company} />
        <DealCell deal={ticket.deal} />
        <TicketsSumCell ticketsSum={{ sum: ticket.amount }} />
        {/* admin &&
          <Table.Cell>
            <strong className={ticket.status}>
              {ticket.status}
            </strong>
            <br />
            {moment(ticket.updatedAt).format('DD/MM/YYYY')}
          </Table.Cell> */}
        {admin &&
          <Table.Cell>
            <Button
              type="button"
              basic
              className="button-link"
              content="Edit"
              onClick={this.updateTicket}
            />
          </Table.Cell>}
        <UpsertTicketModal
          open={this.state.upsertTicketModalOpen}
          onClose={this.onUpsertTicketModalClose}
          ticket={ticket}
        />
        <style jsx>{`
          strong.accepted {
            color: #21ba45;
          }
          strong.pending {
            color: #f2711c;
          }
          strong {
            text-transform: capitalize;
          }
        `}</style>
      </Table.Row>
    );
  }
}

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
  tickets: PropTypes.arrayOf(TicketPropType).isRequired,
};

export default compose(
  connect(({ router }) => ({ router }), null, ({ router }, dispatchProps, ownProps) => ({
    ...ownProps,
    admin: router.admin,
  })),
  graphql(ticketsQuery, {
    props: ({ data: { tickets } }) => ({ tickets: tickets || [] }),
  }),
)(TicketsList);
