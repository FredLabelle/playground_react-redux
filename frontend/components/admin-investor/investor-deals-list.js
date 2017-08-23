import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';
import Link from 'next/link';

import { linkHref, linkAs } from '../../lib/url';
import { DealPropType, RouterPropType } from '../../lib/prop-types';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';
// import TicketsSumCell from '../common/tickets-sum-cell';

const InvestorDealsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Companies</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      {/* <Table.HeaderCell>Tickets</Table.HeaderCell> */}
    </Table.Row>
  </Table.Header>;

const InvestorDealsListRow = ({ deal, router }) =>
  <Link
    prefetch
    href={linkHref('/deals/deal', { ...router, shortId: deal.shortId })}
    as={linkAs('/deals', { ...router, shortId: deal.shortId })}
  >
    <Table.Row className="table-row">
      <CompanyCell company={deal.company} />
      <DealCell deal={deal} />
      {/* */}
    </Table.Row>
  </Link>;
InvestorDealsListRow.propTypes = {
  deal: DealPropType.isRequired,
  router: RouterPropType.isRequired,
};

const InvestorDealsList = ({ deals, router }) =>
  deals.length
    ? <Table basic="very" celled>
        <InvestorDealsListHeader />
        <Table.Body>
          {deals.map(deal => <InvestorDealsListRow key={deal.id} deal={deal} router={router} />)}
        </Table.Body>
      </Table>
    : null;
InvestorDealsList.propTypes = {
  deals: PropTypes.arrayOf(DealPropType).isRequired,
  router: RouterPropType.isRequired,
};

export default connect(({ router }) => ({ router }))(InvestorDealsList);
