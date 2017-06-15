import { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType } from '../../lib/prop-types';
import { linkHref, linkAs } from '../../lib/url';

class AdminMenu extends Component {
  static propTypes = { router: RouterPropType.isRequired };
  componentDidMount() {
    Router.prefetch('/admin');
    Router.prefetch('/admin/deals');
    Router.prefetch('/admin/investors');
    Router.prefetch('/admin/tickets');
    Router.prefetch('/admin/reports');
  }
  onClick = (event, { name }) => {
    event.preventDefault();
    Router.push(linkHref(name, this.props.router), linkAs(name, this.props.router));
  };
  render() {
    const active = (...pathnames) => pathnames.includes(this.props.router.pathname);
    return (
      <Menu attached="top" tabular widths={5}>
        <Menu.Item name="/" active={active('/')} onClick={this.onClick}>
          Dashboard
        </Menu.Item>
        <Menu.Item name="/deals" active={active('/deals', '/deals/new')} onClick={this.onClick}>
          Deals
        </Menu.Item>
        <Menu.Item
          name="/investors"
          active={active('/investors', '/investors/new')}
          onClick={this.onClick}
        >
          Investors
        </Menu.Item>
        <Menu.Item name="/tickets" active={active('/tickets')} onClick={this.onClick}>
          Tickets
        </Menu.Item>
        <Menu.Item name="/reports" active={active('/reports')} onClick={this.onClick}>
          Reports
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect(({ router }) => ({ router }))(AdminMenu);
