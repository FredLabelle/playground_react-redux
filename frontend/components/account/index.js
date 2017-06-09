import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import {
  RouterPropType,
  FormPropType,
  OrganizationPropType,
  MePropType,
} from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import { setUnsavedChanges } from '../../actions/form';
import AccountTab from './account-tab';
import AdministrativeTab from './administrative-tab';
import ParametersTab from './parameters-tab';

class Account extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    form: FormPropType.isRequired,
    organization: OrganizationPropType,
    me: MePropType,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { organization: null, me: null };
  state = { tab: this.props.router.query.tab };
  onClick = event => {
    event.preventDefault();
    if (this.props.form.unsavedChanges) {
      const message = [
        'You have unsaved changes!',
        '',
        'Are you sure you want to leave this page?',
      ].join('\n');
      const confirm = window.confirm(message); // eslint-disable-line no-alert
      if (!confirm) {
        return;
      }
      this.props.setUnsavedChanges(false);
    }
    const shortId = this.props.router.organizationShortId;
    const { tab } = event.target.dataset;
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
        />
        <AdministrativeTab active={active('administrative')} me={this.props.me} />
        <ParametersTab active={active('parameters')} />
      </div>
    );
  }
}

export default compose(
  connect(({ router, form }) => ({ router, form }), { setUnsavedChanges }),
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
