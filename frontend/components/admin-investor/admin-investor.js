import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Grid, Image, Menu, Button, Label } from 'semantic-ui-react';
import { stringify } from 'querystring';
import Link from 'next/link';
import capitalize from 'lodash/capitalize';

import { RouterPropType, OrganizationPropType, InvestorPropType } from '../../lib/prop-types';
import { organizationQuery, investorQuery } from '../../lib/queries';
import UpsertInvestorModal from '../common/upsert-investor-modal';
import SendInvitationModal from '../common/send-invitation-modal';
import InvestorDealsList from './investor-deals-list';
import InvestorTickets from './investor-tickets';

class AdminInvestor extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    investor: InvestorPropType,
  };
  static defaultProps = { organization: null, investor: null };
  state = {
    upsertInvestorModalOpen: false,
    sendInvitationModalOpen: false,
  };
  onUpsertInvestorModalClose = () => {
    this.setState({ upsertInvestorModalOpen: false });
  };
  onSendInvitationModalClose = () => {
    this.setState({ sendInvitationModalOpen: false });
  };
  updateInvestor = () => {
    this.setState({ upsertInvestorModalOpen: true });
  };
  sendInvitation = event => {
    event.preventDefault();
    this.setState({ sendInvitationModalOpen: true });
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
    const active = item => item === (this.props.router.query.item || 'deals');
    const colors = {
      created: 'red',
      invited: 'orange',
      joined: 'green',
    };
    const resend = investor.status === 'invited' ? 'Resend' : '';
    const action = investor.status === 'created' ? 'Send' : resend;
    return (
      <Segment attached="bottom" className="tab active">
        <Grid>
          <Grid.Column width={3}>
            <Image src={investor.picture[0].url} alt={investor.fullName} centered />
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
              <div>
                <strong style={{ marginRight: 16 }}>
                  {investor.fullName === ' ' ? investor.email : investor.fullName}
                </strong>
                <Label color={colors[investor.status]} style={{ marginRight: 16 }}>
                  {capitalize(investor.status)}
                </Label>
                {investor.status !== 'joined' &&
                  <Button
                    type="button"
                    basic
                    content={`${action} invitation`}
                    icon="mail"
                    labelPosition="left"
                    onClick={this.sendInvitation}
                  />}
              </div>
            </div>
          </Grid.Column>
        </Grid>
        <Menu pointing widths={2}>
          {/* <Link replace href={href('account')} as={as('account')}>
            <Menu.Item name="account" active={active('account')} />
          </Link>
          <Link replace href={href('administrative')} as={as('administrative')}>
            <Menu.Item name="administrative" active={active('administrative')} />
          </Link> */}
          <Link replace href={href('deals')} as={as('deals')}>
            <Menu.Item name="deals" active={active('deals')} />
          </Link>
          <Link replace href={href('tickets')} as={as('tickets')}>
            <Menu.Item name="tickets" active={active('tickets')} />
          </Link>
        </Menu>
        {active('account') && <span>ACCOUNT</span>}
        {active('administrative') && <span>ADMINISTRATIVE</span>}
        {active('deals') && <InvestorDealsList deals={investor.deals} />}
        {active('tickets') && <InvestorTickets investor={investor} />}
        <UpsertInvestorModal
          open={this.state.upsertInvestorModalOpen}
          onClose={this.onUpsertInvestorModalClose}
          investor={investor}
          organization={organization}
        />
        <SendInvitationModal
          open={this.state.sendInvitationModalOpen}
          onClose={this.onSendInvitationModalClose}
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
