import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Button } from 'semantic-ui-react';
import omit from 'lodash/omit';

import { sleep } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import { createInvestorMutation } from '../../lib/mutations';
import NewInvestorForm from '../common/new-investor-form';
import InviteModal from './invite-modal';

class CreateNewInvestor extends Component {
  static propTypes = {
    organization: OrganizationPropType,
    // eslint-disable-next-line react/no-unused-prop-types
    createInvestor: PropTypes.func.isRequired,
  };
  static defaultProps = { organization: null };
  state = {
    inviteModalOpen: false,
    loading: false,
    success: false,
  };
  onSubmit = async investor => {
    this.setState({ loading: true });
    const { data: { createInvestor } } = await this.props.createInvestor({
      ...omit(investor, 'password'),
      organizationId: this.props.organization.id,
    });
    if (createInvestor) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('CREATE INVESTOR ERROR');
      this.setState({ loading: false });
    }
  };
  onClick = event => {
    event.preventDefault();
    this.setState({ inviteModalOpen: true });
  };
  onInviteModalClose = () => {
    this.setState({ inviteModalOpen: false });
  };
  render() {
    return (
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        <Segment basic textAlign="right">
          <Button
            type="button"
            primary
            content="Invite investor by email"
            icon="mail"
            labelPosition="left"
            onClick={this.onClick}
          />
        </Segment>
        <NewInvestorForm
          organization={this.props.organization}
          onSubmit={this.onSubmit}
          loading={this.state.loading}
          success={this.state.success}
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
  graphql(createInvestorMutation, {
    props: ({ mutate }) => ({
      createInvestor: input => mutate({ variables: { input } }),
    }),
  }),
)(CreateNewInvestor);