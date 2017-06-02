import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Button, Form, Modal, Header, Icon } from 'semantic-ui-react';
import Router from 'next/router';

import { resetPasswordMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';

class ResetPasswordModal extends Component {
  static propTypes = {
    organizationShortId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    token: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    resetPassword: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies),
  };
  static defaultProps = { token: '', email: '', cookies: null };
  state = {
    password: '',
    repeatPassword: '',
  };
  onSubmit = async event => {
    event.preventDefault();
    // this.props.onClose();
    const { data: { resetPassword } } = await this.props.resetPassword({
      password: this.state.password,
      token: this.props.token,
    });
    if (resetPassword.success) {
      this.props.cookies.set('token', resetPassword.token, { path: '/' });
      Router.push(
        `/account?shortId=${this.props.organizationShortId}`,
        `/organization/${this.props.organizationShortId}/account`,
      );
    } else {
      console.error('RESET PASSWORD ERROR');
    }
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="small">
        <Header icon="privacy" content="Reset password" />
        <Modal.Content>
          <p>
            Reset your password by typing it twice.
          </p>
          <Form id="reset-password" onSubmit={this.onSubmit}>
            <Form.Input
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              label="Password"
              placeholder="Password"
              type="password"
              required
            />
            <Form.Input
              name="repeatPassword"
              value={this.state.repeatPassword}
              onChange={this.handleChange}
              label="Repeat password"
              placeholder="Repeat password"
              type="password"
              required
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" form="reset-password">
            <Icon name="checkmark" /> Reset password
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const ResetPasswordModalWithCookies = withCookies(ResetPasswordModal);

export default graphql(resetPasswordMutation, {
  props: ({ mutate }) => ({
    resetPassword: input =>
      mutate({
        variables: { input },
        refetchQueries: [{ query: meQuery }],
      }),
  }),
})(ResetPasswordModalWithCookies);
