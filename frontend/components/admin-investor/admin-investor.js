import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Grid, Image, Menu, Button } from 'semantic-ui-react';
import { stringify } from 'querystring';
import Link from 'next/link';

import { RouterPropType, OrganizationPropType, InvestorPropType } from '../../lib/prop-types';
import { organizationQuery, investorQuery } from '../../lib/queries';
import UpsertInvestorModal from '../common/upsert-investor-modal';

class AdminInvestor extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    investor: InvestorPropType,
  };
  static defaultProps = { organization: null, investor: null };
  state = { upsertInvestorModalOpen: false };
  onUpsertInvestorModalClose = () => {
    this.setState({ upsertInvestorModalOpen: false });
  };
  updateInvestor = () => {
    this.setState({ upsertInvestorModalOpen: true });
  };
  render() {
    const { organization, investor } = this.props;
    if (!organization || !investor) {
      return null;
    }
    const { organizationShortId } = this.props.router;
    const { shortId: resourceShortId } = investor;
    const queryString = item => stringify({ organizationShortId, resourceShortId, item });
    const href = item => `/admin/investors/investor?${queryString(item)}`;
    const investorsPathname = `/admin/organization/${organizationShortId}/investors`;
    const as = item => `${investorsPathname}/${resourceShortId}?item=${item}`;
    const active = item => item === (this.props.router.query.item || 'account');
    return (
      <Segment attached="bottom" className="tab active">
        <Grid>
          <Grid.Column width={3}>
            <Image
              src={investor.picture[0].url}
              alt={investor.fullName}
              centered
            />
          </Grid.Column>
          <Grid.Column width={13}>
            <div>
              <Button
                type="button"
                primary
                floated="right"
                content="Update investor"
                icon="user"
                labelPosition="left"
                onClick={this.updateInvestor}
              />
              <p>
                <strong>
                  {investor.fullName}
                </strong>
              </p>
            </div>
          </Grid.Column>
        </Grid>
        <Menu pointing widths={4}>
          <Link replace href={href('account')} as={as('account')}>
            <Menu.Item name="account" active={active('account')} />
          </Link>
          <Link replace href={href('administrative')} as={as('administrative')}>
            <Menu.Item name="administrative" active={active('administrative')} />
          </Link>
          <Link replace href={href('deals')} as={as('deals')}>
            <Menu.Item name="deals" active={active('deals')} />
          </Link>
          <Link replace href={href('tickets')} as={as('tickets')}>
            <Menu.Item name="tickets" active={active('tickets')} />
          </Link>
        </Menu>
        {active('account') && <span>ACCOUNT</span>}
        {active('administrative') && <span>ADMINISTRATIVE</span>}
        {active('deals') && <span>DEALS</span>}
        {active('tickets') && <span>TICKETS</span>}
        <UpsertInvestorModal
          open={this.state.upsertInvestorModalOpen}
          onClose={this.onUpsertInvestorModalClose}
          investor={investor}
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
  graphql(investorQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.resourceShortId },
    }),
    props: ({ data: { investor } }) => ({ investor }),
  }),
)(AdminInvestor);
