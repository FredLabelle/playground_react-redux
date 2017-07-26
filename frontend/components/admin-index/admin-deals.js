import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Button } from 'semantic-ui-react';

import { OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import DealsList from '../common/deals-list';
import UpsertDealModal from '../common/upsert-deal-modal';

const defaultAmount = ({ parametersSettings }) => ({
  amount: '',
  currency: parametersSettings.investmentMechanisms.defaultCurrency,
});

const newDeal = organization => ({
  name: '',
  spvName: '',
  description: '',
  deck: [],
  roundSize: defaultAmount(organization),
  premoneyValuation: defaultAmount(organization),
  amountAllocatedToOrganization: defaultAmount(organization),
  minTicket: defaultAmount(organization),
  maxTicket: defaultAmount(organization),
  referenceClosingDate: '',
  carried: '',
  hurdle: '',
});

class AdminDeals extends Component {
  static propTypes = { organization: OrganizationPropType };
  static defaultProps = { organization: null };
  state = { upsertDealModalOpen: false };
  onUpsertDealModalClose = () => {
    this.setState({ upsertDealModalOpen: false });
  };
  createDeal = event => {
    event.preventDefault();
    this.setState({ upsertDealModalOpen: true });
  };
  render() {
    return (
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        <Segment basic textAlign="right">
          <Button
            type="button"
            primary
            content="Create new deal"
            icon="add square"
            labelPosition="left"
            onClick={this.createDeal}
          />
        </Segment>
        <DealsList />
        <UpsertDealModal
          open={this.state.upsertDealModalOpen}
          onClose={this.onUpsertDealModalClose}
          deal={newDeal(this.props.organization)}
          organization={this.props.organization}
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
)(AdminDeals);
