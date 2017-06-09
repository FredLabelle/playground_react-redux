import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Table, Header, Image } from 'semantic-ui-react';
import moment from 'moment';

import { investorsQuery } from '../../lib/queries';

const InvestorsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>;

const InvestorPropType = PropTypes.shape({
  pictureUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  email: PropTypes.string.isRequired,
});

const InvestorsListRow = ({ investor: { pictureUrl, fullName, companyName, createdAt, email } }) =>
  <Table.Row>
    <Table.Cell>
      <Header as="h4" image>
        <Image src={pictureUrl} shape="rounded" size="mini" />
        <Header.Content>
          {fullName}
          <Header.Subheader>{companyName}</Header.Subheader>
        </Header.Content>
      </Header>
    </Table.Cell>
    <Table.Cell>
      35 tickets<br />
      $600.000
    </Table.Cell>
    <Table.Cell>
      35 contacted<br />
      23 commited
    </Table.Cell>
    <Table.Cell>
      <strong style={{ color: '#21ba45' }}>Created</strong><br />
      {moment(createdAt).format('DD/MM/YYYY')}
    </Table.Cell>
    <Table.Cell textAlign="center">
      View | <a href={`mailto:${email}`}>Contact</a> | Delete
    </Table.Cell>
  </Table.Row>;
InvestorsListRow.propTypes = { investor: InvestorPropType.isRequired };

const InvestorsList = ({ investors }) =>
  <Table basic="very" celled>
    <InvestorsListHeader />
    <Table.Body>
      {investors.map(investor =>
        <InvestorsListRow key={investor.pictureUrl} investor={investor} />,
      )}
    </Table.Body>
  </Table>;
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
