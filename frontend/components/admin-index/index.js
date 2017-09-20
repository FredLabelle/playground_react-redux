import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import Router from 'next/router';

import { adminLoginAckMutation } from '../../lib/mutations';
import AdminMenu from '../common/admin-menu';
import AdminGeneral from './admin-general';

class AdminIndex extends Component {
  render() {
    return (
      <div>
        <AdminMenu />
        <AdminGeneral />
      </div>
    );
  }
}

export default compose(
  withCookies,
  connect(({ router }) => ({ router })),
)(AdminIndex);
