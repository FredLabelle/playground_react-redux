import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Button, Form, Modal, Header, Icon } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType } from '../../lib/prop-types';
import { resetPasswordMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';

class ResetPasswordModal extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    resetPassword: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = { password: '', repeatPassword: '' };
  onSubmit = async event => {
    event.preventDefault();
    // this.props.onClose();
    const { data: { resetPassword } } = await this.props.resetPassword({
      password: this.state.password,
      token: this.props.router.query.token,
    });
    if (resetPassword) {
      this.props.cookies.set('token', resetPassword, { path: '/' });
      const shortId = this.props.router.organizationShortId;
      Router.push(`/account?shortId=${shortId}`, `/organization/${shortId}/account`);
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
          <p>Reset your password by typing it twice.</p>
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
          <Button type="submit" color="green" form="reset-password">
            <Icon name="checkmark" /> Reset password
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  withCookies,
  graphql(resetPasswordMutation, {
    props: ({ mutate }) => ({
      resetPassword: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(ResetPasswordModal);
