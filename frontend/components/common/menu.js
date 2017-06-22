import { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType } from '../../lib/prop-types';
import { linkHref, linkAs } from '../../lib/url';

class InvestorMenu extends Component {
  static propTypes = { router: RouterPropType.isRequired };
  componentDidMount() {
    Router.prefetch('/');
  }
  onClick = (event, { name }) => {
    event.preventDefault();
    Router.push(linkHref(name, this.props.router), linkAs(name, this.props.router));
  };
  render() {
    const active = (...pathnames) => pathnames.includes(this.props.router.pathname);
    return (
      <Menu attached="top" tabular widths={2}>
        <Menu.Item name="/" active={active('/')} onClick={this.onClick}>
          Tickets
        </Menu.Item>
        <Menu.Item name="/deals" active={active('/deals')} onClick={this.onClick}>
          Deals
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect(({ router }) => ({ router }))(InvestorMenu);
