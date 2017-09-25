import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import { Segment, Form, Message, Button } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { loginMutation } from '../../lib/mutations';
import { userQuery } from '../../lib/queries';

class LoginForm extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    forgotPassword: PropTypes.func.isRequired,
    onEmailChange: PropTypes.func.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    login: PropTypes.func.isRequired,
  };
  state = {
    email: '',
    password: '',
    loading: false,
    error: false,
  };
  componentDidMount() {
    Router.prefetch('/settings');
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { userLogin } } = await this.props.login({
      email: this.state.email,
      password: this.state.password,
      organizationId: this.props.organization.id,
    });
    if (userLogin) {
      this.props.cookies.set('token', userLogin, { path: '/' });
      Router.push('/', '/');
    } else {
      this.setState({ loading: false, error: true });
    }
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
    if (name === 'email') {
      this.props.onEmailChange(value);
    }
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
          action={{ type: 'button', content: 'Forgot it?', onClick: this.props.forgotPassword }}
          required
        />
        <Message
          error
          header="Authentication error"
          content="Please make sure your email and password are correct."
        />
        <Segment basic textAlign="center">
          <Button
            type="submit"
            primary
            disabled={this.state.loading}
            content="Login"
            icon="user"
            labelPosition="left"
          />
        </Segment>
      </Form>
    );
  }
}

export default compose(
  withCookies,
  connect(({ router }) => ({ router })),
  graphql(loginMutation, {
    props: ({ mutate }) => ({
      login: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            {
              query: userQuery,
              fetchPolicy: 'network-only',
            },
          ],
        }),
    }),
  }),
)(LoginForm);
