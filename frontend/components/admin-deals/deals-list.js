import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Table, Header, Image } from 'semantic-ui-react';
import moment from 'moment';

import { CompanyPropType, AmountPropType } from '../../lib/prop-types';
import { dealsQuery } from '../../lib/queries';

const DealsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Companies</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Reports</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>;

const DealPropType = PropTypes.shape({
  company: CompanyPropType.isRequired,
  category: PropTypes.string.isRequired,
  totalAmount: AmountPropType.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
});

const formatter = currency =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });

const DealsListRow = ({ deal: { company, category, totalAmount, createdAt } }) =>
  <Table.Row>
    <Table.Cell>
      <Header as="h4" image>
        <Image src={`//logo.clearbit.com/${company.domain}?size=192`} size="mini" />
        <Header.Content>
          {company.name}
          <Header.Subheader>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
          </Header.Subheader>
        </Header.Content>
      </Header>
    </Table.Cell>
    <Table.Cell>
      {category}<br />
      {formatter(totalAmount.currency).format(totalAmount.amount)}
    </Table.Cell>
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
      {moment(createdAt).format('DD/MM/YYYY')}
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
