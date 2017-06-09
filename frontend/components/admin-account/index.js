import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, FormPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import { adminLoginAckMutation } from '../../lib/mutations';
import { setUnsavedChanges } from '../../actions/form';
import { linkHref, linkAs } from '../../lib/url';
import GeneralTab from './general-tab';
import UsersTab from './users-tab';
import ParametersTab from './parameters-tab';

class AdminAccount extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    form: FormPropType.isRequired,
    organization: OrganizationPropType,
    // me: MePropType,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    adminLoginAck: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { organization: null, me: null };
  state = { tab: this.props.router.query.tab };
  componentDidMount() {
    const { token } = this.props.router.query;
    if (token) {
      this.props.cookies.set('token', token, { path: '/' });
      this.props.adminLoginAck();
      Router.replace(
        linkHref('/account', this.props.router),
        linkAs('/account', this.props.router),
      );
    }
  }
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
      `/admin/account?shortId=${shortId}&tab=${tab}`,
      `/admin/organization/${shortId}/account?tab=${tab}`,
    );
  };
  render() {
    const active = tab => tab === (this.props.router.query.tab || 'general');
    return (
      this.props.organization &&
      <div>
        <Menu attached="top" tabular widths={3}>
          <Menu.Item data-tab="general" active={active('general')} onClick={this.onClick}>
            Account
          </Menu.Item>
          <Menu.Item data-tab="users" active={active('users')} onClick={this.onClick}>
            Users
          </Menu.Item>
          <Menu.Item data-tab="parameters" active={active('parameters')} onClick={this.onClick}>
            Parameters
          </Menu.Item>
        </Menu>
        <GeneralTab
          active={active('general')}
          organization={this.props.organization}
          setUnsavedChanges={this.props.setUnsavedChanges}
        />
        <UsersTab active={active('users')} />
        <ParametersTab
          active={active('parameters')}
          router={this.props.router}
          organization={this.props.organization}
          setUnsavedChanges={this.props.setUnsavedChanges}
        />
      </div>
    );
  }
}

export default compose(
  withCookies,
  connect(({ router, form }) => ({ router, form }), { setUnsavedChanges }),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  /* graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),*/
  graphql(adminLoginAckMutation, {
    props: ({ mutate }) => ({
      adminLoginAck: () =>
        mutate({
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(AdminAccount);
