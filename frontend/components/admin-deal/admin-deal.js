import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Grid, Image, Menu, Button } from 'semantic-ui-react';
import { stringify } from 'querystring';
import Link from 'next/link';

import { numberFormatter } from '../../lib/util';
import { RouterPropType, DealPropType } from '../../lib/prop-types';
import { dealQuery } from '../../lib/queries';
import UpdateDealModal from './update-deal-modal';
import DealInvestorsList from './deal-investors-list';
import DealTicketsList from './deal-tickets-list';

class AdminDeal extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    deal: DealPropType,
  };
  static defaultProps = { deal: null };
  state = { updateDealModalOpen: false };
  onUpdateDealModalClose = () => {
    this.setState({ updateDealModalOpen: false });
  };
  updateDeal = () => {
    this.setState({ updateDealModalOpen: true });
  };
  render() {
    const { deal } = this.props;
    if (!deal) {
      return null;
    }
    const dealTitle = [
      deal.company.name,
      deal.name,
      deal.category.name,
      numberFormatter(deal.totalAmount.currency).format(deal.totalAmount.amount),
    ].join(' - ');
    const ticketsSumAmount = numberFormatter(deal.ticketsSum.sum.currency).format(
      deal.ticketsSum.sum.amount,
    );
    const ticketsPlural = deal.ticketsSum.count === 1 ? '' : 's';
    const { organizationShortId } = this.props.router;
    const { shortId: resourceShortId } = deal;
    const queryString = item => stringify({ organizationShortId, resourceShortId, item });
    const href = item => `/admin/deals?${queryString(item)}`;
    const dealsPathname = `/admin/organization/${organizationShortId}/deals`;
    const as = item => `${dealsPathname}/${resourceShortId}?item=${item}`;
    const active = item => item === (this.props.router.query.item || 'investors');
    return (
      <Segment attached="bottom" className="tab active">
        <Grid>
          <Grid.Column width={3}>
            <Image
              src={`//logo.clearbit.com/${deal.company.domain}?size=192`}
              alt={deal.company.name}
              centered
            />
          </Grid.Column>
          <Grid.Column width={13}>
            <div>
              <Button
                type="button"
                primary
                floated="right"
                content="Update deal"
                icon="file text outline"
                labelPosition="left"
                onClick={this.updateDeal}
              />
              <strong>
                {dealTitle}
              </strong>
            </div>
            <br />
            <br />
            <br />
            <p>
              {ticketsSumAmount} ({deal.ticketsSum.count} ticket{ticketsPlural})
            </p>
          </Grid.Column>
        </Grid>
        <Menu pointing widths={3}>
          <Link replace href={href('investors')} as={as('investors')}>
            <Menu.Item name="investors" active={active('investors')} />
          </Link>
          <Link replace href={href('tickets')} as={as('tickets')}>
            <Menu.Item name="tickets" active={active('tickets')} />
          </Link>
          <Link replace href={href('reports')} as={as('reports')}>
            <Menu.Item name="reports" active={active('reports')} />
          </Link>
        </Menu>
        {active('investors') && <DealInvestorsList investors={deal.investors} />}
        {active('tickets') && <DealTicketsList tickets={deal.tickets} />}
        {active('reports') && <span>REPORTS</span>}
        <UpdateDealModal
          open={this.state.updateDealModalOpen}
          onClose={this.onUpdateDealModalClose}
          deal={this.props.deal}
        />
      </Segment>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(dealQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.resourceShortId },
    }),
    props: ({ data: { deal } }) => ({ deal }),
  }),
)(AdminDeal);
