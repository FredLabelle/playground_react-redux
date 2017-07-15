import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Button } from 'semantic-ui-react';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import InvestorsList from './investors-list';
import UpsertInvestorModal from '../common/upsert-investor-modal';
import InviteModal from './invite-modal';

const newInvestor = ({ query }) => ({
  email: query.email || '',
  phone: '',
  name: {
    firstName: query.firstName || '',
    lastName: query.lastName || '',
  },
  password: '',
  investmentSettings: {},
  type: 'individual',
  individualSettings: {
    birthdate: '01-01-1970',
    nationality: '',
    idDocuments: [],
    fiscalAddress: {
      address1: '',
      address2: '',
      city: '',
      zipCode: '',
      country: '',
      state: '',
    },
  },
  corporationSettings: {
    position: '',
    companyName: '',
    companyAddress: {
      address1: '',
      address2: '',
      city: '',
      zipCode: '',
      country: '',
      state: '',
    },
    incProof: [],
  },
  advisor: {
    name: { firstName: '', lastName: '' },
    email: '',
  },
});

class AdminInvestors extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
  };
  static defaultProps = { organization: null };
  state = { upsertInvestorModalOpen: false, inviteModalOpen: false };
  onUpsertInvestorModalClose = () => {
    this.setState({ upsertInvestorModalOpen: false });
  };
  onInviteModalClose = () => {
    this.setState({ inviteModalOpen: false });
  };
  createInvestor = event => {
    event.preventDefault();
    this.setState({ upsertInvestorModalOpen: true });
  };
  openInviteModal = event => {
    event.preventDefault();
    this.setState({ inviteModalOpen: true });
  };
  render() {
    return (
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        <Segment basic textAlign="right">
          <Button
            type="button"
            primary
            content="Create new investor"
            icon="add user"
            labelPosition="left"
            onClick={this.createInvestor}
          />
          <Button
            type="button"
            primary
            content="Invite investor by email"
            icon="mail"
            labelPosition="left"
            onClick={this.openInviteModal}
          />
        </Segment>
        <InvestorsList />
        <UpsertInvestorModal
          open={this.state.upsertInvestorModalOpen}
          onClose={this.onUpsertInvestorModalClose}
          investor={newInvestor(this.props.router)}
          organization={this.props.organization}
        />
        <InviteModal
          open={this.state.inviteModalOpen}
          onClose={this.onInviteModalClose}
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
)(AdminInvestors);
