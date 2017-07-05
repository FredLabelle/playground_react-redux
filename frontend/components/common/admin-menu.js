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
    Router.prefetch('/admin/investors');
    Router.prefetch('/admin/tickets');
    // Router.prefetch('/admin/reports');
  }
  onClick = (event, { name }) => {
    event.preventDefault();
    Router.push(linkHref(name, this.props.router), linkAs(name, this.props.router));
  };
  render() {
    const { pathname } = this.props.router;
    return (
      <Menu attached="top" tabular widths={3}>
        <Menu.Item
          name="/"
          active={pathname === '/' || pathname.startsWith('/deals')}
          onClick={this.onClick}
        >
          Deals
        </Menu.Item>
        <Menu.Item
          name="/investors"
          active={pathname.startsWith('/investors')}
          onClick={this.onClick}
        >
          Investors
        </Menu.Item>
        <Menu.Item name="/tickets" active={pathname.startsWith('/tickets')} onClick={this.onClick}>
          Tickets
        </Menu.Item>
        {/* <Menu.Item name="/reports" active={active('/reports')} onClick={this.onClick}>
          Reports
        </Menu.Item>*/}
      </Menu>
    );
  }
}

export default connect(({ router }) => ({ router }))(AdminMenu);
