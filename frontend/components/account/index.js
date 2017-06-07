import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, OrganizationPropType, MePropType } from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import AccountTab from './account-tab';
import AdministrativeTab from './administrative-tab';
import ParametersTab from './parameters-tab';

class Account extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    me: MePropType,
  };
  static defaultProps = { organization: null, me: null };
  state = {
    tab: this.props.router.query.tab,
    unsavedChanges: false,
  };
  onUnsavedChangesChange = unsavedChanges => {
    this.setState({ unsavedChanges });
  };
  onClick = event => {
    event.preventDefault();
    const shortId = this.props.router.organizationShortId;
    const { tab } = event.target.dataset;
    if (this.state.unsavedChanges) {
      const message = [
        'You have unsaved changes!',
        '',
        'Are you sure you want to leave this page?',
      ].join('\n');
      const confirm = window.confirm(message); // eslint-disable-line no-alert
      if (confirm) {
        this.setState({ unsavedChanges: false });
      } else {
        return;
      }
    }
    Router.replace(
      `/account?shortId=${shortId}&tab=${tab}`,
      `/organization/${shortId}/account?tab=${tab}`,
    );
  };
  render() {
    const active = tab => tab === (this.props.router.query.tab || 'account');
    return (
      this.props.me &&
      <div>
        <Menu attached="top" tabular widths={3}>
          <Menu.Item active={active('account')} data-tab="account" onClick={this.onClick}>
            Account
          </Menu.Item>
          <Menu.Item
            active={active('administrative')}
            data-tab="administrative"
            onClick={this.onClick}
          >
            Administrative
          </Menu.Item>
          <Menu.Item active={active('parameters')} data-tab="parameters" onClick={this.onClick}>
            Parameters
          </Menu.Item>
        </Menu>
        <AccountTab
          active={active('account')}
          me={this.props.me}
          organization={this.props.organization}
          onUnsavedChangesChange={this.onUnsavedChangesChange}
        />
        <AdministrativeTab
          active={active('administrative')}
          me={this.props.me}
          onUnsavedChangesChange={this.onUnsavedChangesChange}
        />
        <ParametersTab active={active('parameters')} />
      </div>
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
  graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),
)(Account);
