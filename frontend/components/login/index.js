import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Router from 'next/router';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import Login from '../common/login';
import Form from './form';
import ForgotPasswordModal from './forgot-password-modal';
import ResetPasswordModal from './reset-password-modal';

class UserLogin extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
  };
  static defaultProps = { organization: null };
  state = {
    email: '',
    forgotPasswordModalOpen: false,
    resetPasswordModalOpen: !!this.props.router.query.resetPasswordToken,
  };
  onEmailChange = email => {
    this.setState({ email });
  };
  onForgotPasswordModalClose = () => {
    this.setState({ forgotPasswordModalOpen: false });
  };
  onResetPasswordModalClose = () => {
    this.setState({ resetPasswordModalOpen: false });
    Router.replace('/login', '/login');
  };
  forgotPassword = event => {
    event.preventDefault();
    this.setState({ forgotPasswordModalOpen: true });
  };
  render() {
    return (
      this.props.organization &&
      <Login organization={this.props.organization}>
        <Form
          organization={this.props.organization}
          forgotPassword={this.forgotPassword}
          onEmailChange={this.onEmailChange}
        />
        <ForgotPasswordModal
          open={this.state.forgotPasswordModalOpen}
          onClose={this.onForgotPasswordModalClose}
          email={this.state.email}
          organization={this.props.organization}
        />
        <ResetPasswordModal
          open={this.state.resetPasswordModalOpen}
          onClose={this.onResetPasswordModalClose}
          router={this.props.router}
        />
      </Login>
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
)(UserLogin);
