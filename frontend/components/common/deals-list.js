import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
// import moment from 'moment';

import { DealPropType } from '../../lib/prop-types';
import { dealsQuery } from '../../lib/queries';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';
import TicketsCell from '../common/tickets-cell';

const DealsListHeader = ({ admin }) =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Companies</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      {admin && <Table.HeaderCell>Tickets</Table.HeaderCell>}
      {/* <Table.HeaderCell>Reports</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>*/}
    </Table.Row>
  </Table.Header>;
DealsListHeader.propTypes = { admin: PropTypes.bool.isRequired };

const DealsListRow = ({ admin, deal }) =>
  <Table.Row>
    <CompanyCell company={deal.company} />
    <DealCell deal={deal} />
    <Table.Cell>
      35 contacted<br />
      23 commited
    </Table.Cell>
    {admin && <TicketsCell tickets={deal.tickets} />}
    {/* <Table.Cell>
      35 contacted<br />
      35 contacted
    </Table.Cell>
    <Table.Cell>
      <strong>Open</strong><br />
      {moment(deal.createdAt).format('DD/MM/YYYY')}
    </Table.Cell>
    <Table.Cell>
      View | Share | Close
    </Table.Cell>*/}
    <style jsx>{`
      strong {
        color: #21ba45;
      }
    `}</style>
  </Table.Row>;
DealsListRow.propTypes = {
  admin: PropTypes.bool.isRequired,
  deal: DealPropType.isRequired,
};

const DealsList = ({ admin, deals }) =>
  deals.length
    ? <Table basic="very" celled>
        <DealsListHeader admin={admin} />
        <Table.Body>
          {deals.map(deal => <DealsListRow key={deal.id} admin={admin} deal={deal} />)}
        </Table.Body>
      </Table>
    : null;
DealsList.propTypes = {
  admin: PropTypes.bool.isRequired,
  deals: PropTypes.arrayOf(DealPropType),
};
DealsList.defaultProps = { deals: [] };

export default compose(
  connect(({ router }) => ({ router }), null, ({ router }, dispatchProps, ownProps) => (
    Object.assign({ admin: router.admin === '/admin' }, ownProps)
  )),
  graphql(dealsQuery, {
    props: ({ data: { deals } }) => ({
      deals: deals
        ? deals.map(deal => ({
            ...deal,
            createdAt: new Date(deal.createdAt),
          }))
        : [],
    }),
  }),
)(DealsList);
