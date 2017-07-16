import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';
import InvestorCell from '../common/investor-cell';
import TicketsSumCell from '../common/tickets-sum-cell';

const DealInvestorsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const DealInvestorsListRow = ({ investor }) =>
  <Table.Row>
    <InvestorCell investor={investor} />
    <TicketsSumCell ticketsSum={investor.ticketsSum} />
  </Table.Row>;
DealInvestorsListRow.propTypes = { investor: InvestorPropType.isRequired };

const DealInvestorsList = ({ investors }) =>
  investors.length
    ? <Table basic="very" celled>
        <DealInvestorsListHeader />
        <Table.Body>
          {investors.map(investor =>
            <DealInvestorsListRow key={investor.id} investor={investor} />,
          )}
        </Table.Body>
      </Table>
    : null;
DealInvestorsList.propTypes = { investors: PropTypes.arrayOf(InvestorPropType).isRequired };

export default DealInvestorsList;
