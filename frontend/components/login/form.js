import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Form, Message, Button } from 'semantic-ui-react';
import Router from 'next/router';

import { login } from '../../actions/auth';
import ForgotPasswordModal from './forgot-password-modal';
import ResetPasswordModal from './reset-password-modal';

class LoginForm extends Component {
  static propTypes = {
    organizationShortId: PropTypes.string.isRequired,
    query: PropTypes.shape({
      reset: PropTypes.string,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
  };
  state = {
    email: '',
    password: '',
    forgotPasswordModalOpen: false,
    resetPasswordModalOpen: !!this.props.query.reset,
  };
  onSubmit = event => {
    event.preventDefault();
    this.props.login({
      ...this.state,
      organizationShortId: this.props.organizationShortId,
    });
  };
  onForgotPasswordModalClose = () => {
    this.setState({ forgotPasswordModalOpen: false });
  };
  onResetPasswordModalClose = () => {
    this.setState({ resetPasswordModalOpen: false });
    Router.replace(
      `/login?shortId=${this.props.organizationShortId}`,
      `/organization/${this.props.organizationShortId}/login`,
    );
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  forgotPassword = event => {
    event.preventDefault();
    this.setState({ forgotPasswordModalOpen: true });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={this.props.error}>
        <Form.Input
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          label="Email"
          placeholder="Email"
          type="email"
          required
        />
        <Form.Input
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
          label="Password"
          placeholder="Password"
          type="password"
          action={{ content: 'Forgot it?', onClick: this.forgotPassword }}
          required
        />
        <Message
          error
          header="Authentication error"
          content="Please make sure your email and password are correct."
        />
        <Segment basic textAlign="center">
          <Button primary disabled={this.props.loading}>Login</Button>
        </Segment>
        <ForgotPasswordModal
          open={this.state.forgotPasswordModalOpen}
          onClose={this.onForgotPasswordModalClose}
          email={this.state.email}
        />
        <ResetPasswordModal
          open={this.state.resetPasswordModalOpen}
          onClose={this.onResetPasswordModalClose}
          token={this.props.query.reset}
        />
      </Form>
    );
  }
}

const mapStateToProps = ({ router, auth }) => ({ ...router, ...auth });

export default connect(mapStateToProps, { login })(LoginForm);
