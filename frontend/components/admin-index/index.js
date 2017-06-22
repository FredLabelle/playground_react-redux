import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import Router from 'next/router';

import { RouterPropType } from '../../lib/prop-types';
import { meQuery } from '../../lib/queries';
import { adminLoginAckMutation } from '../../lib/mutations';
import { linkHref, linkAs } from '../../lib/url';
import AdminMenu from '../common/admin-menu';
import AdminDeals from './admin-deals';

class AdminIndex extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    adminLoginAck: PropTypes.func.isRequired,
  };
  componentDidMount() {
    const { token } = this.props.router.query;
    if (token) {
      this.props.cookies.set('token', token, { path: '/' });
      this.props.adminLoginAck();
      Router.replace(linkHref('/', this.props.router), linkAs('/', this.props.router));
    }
  }
  render() {
    return (
      <div>
        <AdminMenu />
        <AdminDeals />
      </div>
    );
  }
}

export default compose(
  withCookies,
  connect(({ router }) => ({ router })),
  graphql(adminLoginAckMutation, {
    props: ({ mutate }) => ({
      adminLoginAck: () =>
        mutate({
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(AdminIndex);
