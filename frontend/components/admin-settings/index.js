import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, FormPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import { setUnsavedChanges } from '../../actions/form';
import GeneralTab from './general-tab';
import UsersTab from './users-tab';
import ParametersTab from './parameters-tab';

class AdminSettings extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    form: FormPropType.isRequired,
    organization: OrganizationPropType,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { organization: null };
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
      `/admin/settings?shortId=${shortId}&tab=${tab}`,
      `/admin/organization/${shortId}/settings?tab=${tab}`,
    );
  };
  render() {
    const active = tab => tab === (this.props.router.query.tab || 'general');
    return (
      this.props.organization &&
      <div>
        <Menu attached="top" tabular widths={3}>
          <Menu.Item data-tab="general" active={active('general')} onClick={this.onClick}>
            General
          </Menu.Item>
          <Menu.Item data-tab="users" active={active('users')} onClick={this.onClick}>
            Users
          </Menu.Item>
          <Menu.Item data-tab="parameters" active={active('parameters')} onClick={this.onClick}>
            Parameters
          </Menu.Item>
        </Menu>
        <GeneralTab active={active('general')} organization={this.props.organization} />
        <UsersTab active={active('users')} />
        <ParametersTab
          active={active('parameters')}
          router={this.props.router}
          organization={this.props.organization}
        />
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
)(AdminSettings);
