import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { InvestorPropType } from '../../lib/prop-types';
import { investorsQuery } from '../../lib/queries';
import InvestorCell from '../common/investor-cell';

const InvestorsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const InvestorsListRow = ({ investor }) =>
  <Table.Row>
    <InvestorCell investor={investor} />
    <Table.Cell>
      35 tickets<br />
      $600.000
    </Table.Cell>
    <Table.Cell>
      35 contacted<br />
      23 commited
    </Table.Cell>
    <Table.Cell>
      <strong>Created</strong><br />
      {moment(investor.createdAt).format('DD/MM/YYYY')}
    </Table.Cell>
    <Table.Cell textAlign="center">
      View | <a href={`mailto:${investor.email}`}>Contact</a> | Delete
    </Table.Cell>
    <style jsx>{`
      strong {
        color: #21ba45;
      }
    `}</style>
  </Table.Row>;
InvestorsListRow.propTypes = { investor: InvestorPropType.isRequired };

const InvestorsList = ({ investors }) =>
  investors.length
    ? <Table basic="very" celled>
        <InvestorsListHeader />
        <Table.Body>
          {investors.map(investor => <InvestorsListRow key={investor.id} investor={investor} />)}
        </Table.Body>
      </Table>
    : null;
InvestorsList.propTypes = { investors: PropTypes.arrayOf(InvestorPropType) };
InvestorsList.defaultProps = { investors: [] };

export default graphql(investorsQuery, {
  props: ({ data: { investors } }) => ({
    investors: investors
      ? investors.map(investor => ({
          ...investor,
          createdAt: new Date(investor.createdAt),
          pictureUrl: investor.picture.url,
          companyName: investor.corporationSettings.companyName,
        }))
      : [],
  }),
})(InvestorsList);
