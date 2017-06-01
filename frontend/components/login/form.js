import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import { Segment, Form, Message, Button } from 'semantic-ui-react';
import Router from 'next/router';

import { investorLoginMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import ForgotPasswordModal from './forgot-password-modal';
import ResetPasswordModal from './reset-password-modal';

class LoginForm extends Component {
  static propTypes = {
    organizationShortId: PropTypes.string.isRequired,
    query: PropTypes.shape({
      token: PropTypes.string,
    }).isRequired,
    cookies: PropTypes.instanceOf(Cookies),
    login: PropTypes.func.isRequired,
  };
  static defaultProps = { cookies: null };
  state = {
    email: '',
    password: '',
    forgotPasswordModalOpen: false,
    resetPasswordModalOpen: !!this.props.query.token,
    loading: false,
    error: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { investorLogin } } = await this.props.login({
      email: this.state.email,
      password: this.state.password,
      organizationShortId: this.props.organizationShortId,
    });
    if (investorLogin.success) {
      this.props.cookies.set('token', investorLogin.token, { path: '/' });
      Router.push(
        `/?shortId=${this.props.organizationShortId}`,
        `/organization/${this.props.organizationShortId}`,
      );
    } else {
      this.setState({ loading: false, error: true });
    }
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
      <Form onSubmit={this.onSubmit} error={this.state.error}>
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
          <Button primary disabled={this.state.loading}>Login</Button>
        </Segment>
        <ForgotPasswordModal
          open={this.state.forgotPasswordModalOpen}
          onClose={this.onForgotPasswordModalClose}
          email={this.state.email}
        />
        <ResetPasswordModal
          organizationShortId={this.props.organizationShortId}
          open={this.state.resetPasswordModalOpen}
          onClose={this.onResetPasswordModalClose}
          token={this.props.query.token}
        />
      </Form>
    );
  }
}

const LoginFormWithCookies = withCookies(LoginForm);

const LoginFormWithGraphQL = graphql(investorLoginMutation, {
  props: ({ mutate }) => ({
    login: input =>
      mutate({
        variables: { input },
        refetchQueries: [{ query: meQuery }],
      }),
  }),
})(LoginFormWithCookies);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(LoginFormWithGraphQL);
