import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Grid, Image, Menu, Button } from 'semantic-ui-react';
import { stringify } from 'querystring';
import Link from 'next/link';

import FormatAmount from '../common/format-amount';
import { RouterPropType, OrganizationPropType, DealPropType } from '../../lib/prop-types';
import { organizationQuery, dealQuery } from '../../lib/queries';
import UpsertDealModal from '../common/upsert-deal-modal';
import DealInvestorsList from './deal-investors-list';
import DealTicketsList from './deal-tickets-list';

class AdminDeal extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    deal: DealPropType,
  };
  static defaultProps = { organization: null, deal: null };
  state = { upsertDealModalOpen: false };
  onUpsertDealModalClose = () => {
    this.setState({ upsertDealModalOpen: false });
  };
  updateDeal = () => {
    this.setState({ upsertDealModalOpen: true });
  };
  render() {
    const { organization, deal } = this.props;
    if (!organization || !deal) {
      return null;
    }
    const ticketsPlural = deal.ticketsSum.count === 1 ? '' : 's';
    const { organizationShortId } = this.props.router;
    const { shortId: resourceShortId } = deal;
    const queryString = item => stringify({ organizationShortId, resourceShortId, item });
    const href = item => `/admin/deals/deal?${queryString(item)}`;
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
              <p>
                <strong>
                  {deal.company.name} - {deal.name} - {deal.category.name}
                </strong>
              </p>
              <p>
                <strong>
                  <FormatAmount amount={deal.amountAllocatedToOrganization} /> (size of the round:{' '}
                  <FormatAmount amount={deal.roundSize} />)
                </strong>
              </p>
            </div>
            <br />
            <br />
            <br />
            <p>
              <FormatAmount amount={deal.ticketsSum.sum} /> ({deal.ticketsSum.count} ticket{ticketsPlural})
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
        <UpsertDealModal
          open={this.state.upsertDealModalOpen}
          onClose={this.onUpsertDealModalClose}
          deal={deal}
          organization={organization}
        />
      </Segment>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(dealQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.resourceShortId },
    }),
    props: ({ data: { deal } }) => ({ deal }),
  }),
)(AdminDeal);
