import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { DealPropType } from '../../lib/prop-types';
import { dealsQuery } from '../../lib/queries';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';

const DealsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Companies</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Reports</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const DealsListRow = ({ deal }) =>
  <Table.Row>
    <CompanyCell company={deal.company} />
    <DealCell deal={deal} />
    <Table.Cell>
      35 contacted<br />
      23 commited
    </Table.Cell>
    <Table.Cell>
      23 tickets<br />
      $300.000
    </Table.Cell>
    <Table.Cell>
      35 contacted<br />
      35 contacted
    </Table.Cell>
    <Table.Cell>
      <strong>Open</strong><br />
      {moment(deal.createdAt).format('DD/MM/YYYY')}
    </Table.Cell>
    <Table.Cell textAlign="center">
      View | Share | Close
    </Table.Cell>
    <style jsx>{`
      strong {
        color: #21ba45;
      }
    `}</style>
  </Table.Row>;
DealsListRow.propTypes = { deal: DealPropType.isRequired };

const DealsList = ({ deals }) =>
  deals.length
    ? <Table basic="very" celled>
        <DealsListHeader />
        <Table.Body>
          {deals.map(deal => <DealsListRow key={deal.id} deal={deal} />)}
        </Table.Body>
      </Table>
    : null;
DealsList.propTypes = { deals: PropTypes.arrayOf(DealPropType) };
DealsList.defaultProps = { deals: [] };

export default graphql(dealsQuery, {
  props: ({ data: { deals } }) => ({
    deals: deals
      ? deals.map(deal => ({
          ...deal,
          createdAt: new Date(deal.createdAt),
        }))
      : [],
  }),
})(DealsList);
