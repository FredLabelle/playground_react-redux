import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, FormPropType } from '../../lib/prop-types';
import { setUnsavedChanges } from '../../actions/form';
import { linkHref, linkAs } from '../../lib/url';

class SettingsMenu extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    form: FormPropType.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  componentDidMount() {
    Router.prefetch('/settings');
    Router.prefetch('/settings/administrative');
    Router.prefetch('/settings/parameters');
  }
  onClick = (event, { name }) => {
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
    Router.push(linkHref(name, this.props.router), linkAs(name, this.props.router));
  };
  render() {
    const active = (...pathnames) => pathnames.includes(this.props.router.pathname);
    return (
      <Menu attached="top" tabular widths={3}>
        <Menu.Item name="/settings" active={active('/settings')} onClick={this.onClick}>
          Account
        </Menu.Item>
        <Menu.Item
          name="/settings/administrative"
          active={active('/settings/administrative')}
          onClick={this.onClick}
        >
          Administrative
        </Menu.Item>
        <Menu.Item
          name="/settings/parameters"
          active={active('/settings/parameters')}
          onClick={this.onClick}
        >
          Parameters
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect(({ router, form }) => ({ router, form }), { setUnsavedChanges })(
  SettingsMenu,
);
