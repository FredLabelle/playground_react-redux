import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { InvestorPropType } from '../../lib/prop-types';
import { investorsQuery } from '../../lib/queries';
import InvestorCell from '../common/investor-cell';
import TicketsSumCell from '../common/tickets-sum-cell';

const InvestorsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const InvestorsListRow = ({ investor }) =>
  <Table.Row>
    <InvestorCell investor={investor} />
    <TicketsSumCell ticketsSum={investor.ticketsSum} />
    <Table.Cell>
      <strong className={investor.status}>
        {investor.status}
      </strong>
      <br />
      {moment(investor.updatedAt).format('DD/MM/YYYY')}
    </Table.Cell>
    <Table.Cell>
      <a href={`mailto:${investor.email}`}>Contact</a>
    </Table.Cell>
    <style jsx>{`
      strong.invited {
        color: #f2711c;
      }
      strong.joined {
        color: #21ba45;
      }
      strong {
        text-transform: capitalize;
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
  props: ({ data: { investors } }) => ({ investors: investors || [] }),
})(InvestorsList);
