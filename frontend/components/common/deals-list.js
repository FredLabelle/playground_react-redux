import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Table } from 'semantic-ui-react';
import Router from 'next/router';
// import moment from 'moment';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType, DealPropType } from '../../lib/prop-types';
import { dealsQuery } from '../../lib/queries';
import CompanyCell from '../common/company-cell';
import DealCell from '../common/deal-cell';
import TicketsSumCell from '../common/tickets-sum-cell';

const DealsListHeader = ({ router }) =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Companies</Table.HeaderCell>
      <Table.HeaderCell>Deal</Table.HeaderCell>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      {router.admin && <Table.HeaderCell>Tickets</Table.HeaderCell>}
      {/* <Table.HeaderCell>Reports</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>*/}
    </Table.Row>
  </Table.Header>;
DealsListHeader.propTypes = { router: RouterPropType.isRequired };

class DealsListRow extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    deal: DealPropType.isRequired,
  };
  onClick = (router, deal) => event => {
    event.preventDefault();
    if (!router.admin) {
      return;
    }
    Router.push(
      linkHref(`/deals/${deal.shortId}`, router),
      linkAs(`/deals/${deal.shortId}`, router),
    );
  };
  render() {
    const { router, deal } = this.props;
    return (
      <Table.Row className={router.admin ? 'table-row' : ''} onClick={this.onClick(router, deal)}>
        <CompanyCell company={deal.company} />
        <DealCell deal={deal} />
        <Table.Cell>
          {deal.investorsCommited} commited
        </Table.Cell>
        {router.admin && <TicketsSumCell ticketsSum={deal.ticketsSum} />}
        {/* <Table.Cell>
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
      </Table.Row>
    );
  }
}

const DealsList = ({ router, deals }) =>
  deals.length
    ? <Table basic="very" celled>
        <DealsListHeader router={router} />
        <Table.Body>
          {deals.map(deal => <DealsListRow key={deal.id} router={router} deal={deal} />)}
        </Table.Body>
      </Table>
    : null;
DealsList.propTypes = {
  router: RouterPropType.isRequired,
  deals: PropTypes.arrayOf(DealPropType),
};
DealsList.defaultProps = { deals: [] };

export default compose(
  connect(({ router }) => ({ router })),
  graphql(dealsQuery, {
    props: ({ data: { deals } }) => ({ deals: deals || [] }),
  }),
)(DealsList);
