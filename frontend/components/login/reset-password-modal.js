import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Button, Form, Modal, Header } from 'semantic-ui-react';
import Router from 'next/router';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';
import { resetPasswordMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import PasswordField from '../fields/password-field';

class ResetPasswordModal extends Component {
  static propTypes = {
    error: PropTypes.bool.isRequired,
    router: RouterPropType.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    resetPassword: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = { password: '' };
  onSubmit = async event => {
    event.preventDefault();
    const { data: { resetPassword } } = await this.props.resetPassword({
      password: this.state.password,
      token: this.props.router.query.resetPasswordToken,
    });
    if (resetPassword) {
      this.props.cookies.set('token', resetPassword, { path: '/' });
      Router.push(linkHref('/settings', this.props.router), linkAs('/settings', this.props.router));
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
          <Form id="reset-password" onSubmit={this.onSubmit} error={this.props.error}>
            <PasswordField
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="reset-password"
            color="green"
            disabled={this.props.error}
            content="Reset password"
            icon="checkmark"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  withCookies,
  connect(({ form }) => ({ form }), null, ({ form }, dispatchProps, ownProps) => {
    const error = form.passwordsMismatch || form.passwordTooWeak;
    return Object.assign({ error }, ownProps);
  }),
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
