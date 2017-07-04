import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Button } from 'semantic-ui-react';
import omit from 'lodash/omit';
import Router from 'next/router';

import { linkHref, linkAs } from '../../lib/url';
import { sleep } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery, investorsQuery } from '../../lib/queries';
import { createInvestorMutation } from '../../lib/mutations';
import NewInvestorForm from '../common/new-investor-form';
import InviteModal from './invite-modal';

class CreateNewInvestor extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
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
    const newInvestor = omit(investor, 'password');
    const { data: { createInvestor } } = await this.props.createInvestor(newInvestor);
    if (createInvestor) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
      Router.push(
        linkHref('/investors', this.props.router),
        linkAs('/investors', this.props.router),
      );
    } else {
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
      createInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: investorsQuery }],
        }),
    }),
  }),
)(CreateNewInvestor);
