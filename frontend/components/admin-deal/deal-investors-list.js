import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';
import Link from 'next/link';

import { linkHref, linkAs } from '../../lib/url';
import { InvestorPropType, RouterPropType } from '../../lib/prop-types';
import InvestorCell from '../common/investor-cell';
import TicketsSumCell from '../common/tickets-sum-cell';

const DealInvestorsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

const DealInvestorsListRow = ({ investor, router }) =>
  <Link
    prefetch
    href={linkHref('/investors/investor', { ...router, shortId: investor.shortId })}
    as={linkAs('/investors', { ...router, shortId: investor.shortId })}
  >
    <Table.Row className="table-row">
      <InvestorCell investor={investor} />
      <TicketsSumCell ticketsSum={investor.ticketsSum} />
    </Table.Row>
  </Link>;
DealInvestorsListRow.propTypes = {
  investor: InvestorPropType.isRequired,
  router: RouterPropType.isRequired,
};

const DealInvestorsList = ({ investors, router }) =>
  investors.length
    ? <Table basic="very" celled>
        <DealInvestorsListHeader />
        <Table.Body>
          {investors.map(investor =>
            <DealInvestorsListRow key={investor.id} investor={investor} router={router} />,
          )}
        </Table.Body>
      </Table>
    : null;
DealInvestorsList.propTypes = {
  investors: PropTypes.arrayOf(InvestorPropType).isRequired,
  router: RouterPropType.isRequired,
};

export default connect(({ router }) => ({ router }))(DealInvestorsList);
