import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import { Segment, Form, Message, Button } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { investorLoginMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import ForgotPasswordModal from './forgot-password-modal';
import ResetPasswordModal from './reset-password-modal';

class LoginForm extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    login: PropTypes.func.isRequired,
  };
  state = {
    email: '',
    password: '',
    forgotPasswordModalOpen: false,
    resetPasswordModalOpen: !!this.props.router.query.token,
    loading: false,
    error: false,
  };
  componentDidMount() {
    Router.prefetch('/account');
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { investorLogin } } = await this.props.login({
      email: this.state.email,
      password: this.state.password,
      organizationId: this.props.organization.id,
    });
    if (investorLogin) {
      this.props.cookies.set('token', investorLogin, { path: '/' });
      const { shortId } = this.props.organization;
      Router.push(`/account?shortId=${shortId}`, `/organization/${shortId}/account`);
    } else {
      this.setState({ loading: false, error: true });
    }
  };
  onForgotPasswordModalClose = () => {
    this.setState({ forgotPasswordModalOpen: false });
  };
  onResetPasswordModalClose = () => {
    this.setState({ resetPasswordModalOpen: false });
    const { shortId } = this.props.organization;
    Router.replace(`/login?shortId=${shortId}`, `/organization/${shortId}/login`);
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
          organization={this.props.organization}
        />
        <ResetPasswordModal
          open={this.state.resetPasswordModalOpen}
          onClose={this.onResetPasswordModalClose}
          router={this.props.router}
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

const mapStateToProps = ({ router }) => ({ router });

export default connect(mapStateToProps)(LoginFormWithGraphQL);
