import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import Router from 'next/router';

import { sleep } from '../../lib/util';
import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';
import { resetPasswordMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import PasswordField from '../fields/password-field';

const initialState = { password: '', loading: false, success: false };

class ResetPasswordModal extends Component {
  static propTypes = {
    warning: PropTypes.bool.isRequired,
    router: RouterPropType.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    resetPassword: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = initialState;
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { resetPassword } } = await this.props.resetPassword({
      password: this.state.password,
      token: this.props.router.query.resetPasswordToken,
    });
    if (resetPassword) {
      this.setState({ success: true });
      await sleep(2000);
      this.props.cookies.set('token', resetPassword, { path: '/' });
      Router.push(linkHref('/', this.props.router), linkAs('/', this.props.router));
    } else {
      console.error('RESET PASSWORD ERROR');
      this.setState({ loading: false });
    }
  };
  onClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Modal open={this.props.open} onClose={this.onClose} size="small">
        <Header icon="privacy" content="Reset password" />
        <Modal.Content>
          <p>Reset your password by typing it twice.</p>
          <Form
            id="reset-password"
            onSubmit={this.onSubmit}
            warning={this.props.warning}
            success={this.state.success}
          >
            <PasswordField
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <Message success header="Success!" content="Your password has been reset." />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="reset-password"
            color="green"
            disabled={this.state.loading || this.props.warning}
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
  connect(({ form }) => ({ form }), null, ({ form }, dispatchProps, ownProps) => ({
    ...ownProps,
    warning: form.passwordsMismatch || form.passwordTooWeak,
  })),
  graphql(resetPasswordMutation, {
    props: ({ mutate }) => ({
      resetPassword: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            {
              query: meQuery,
              fetchPolicy: 'network-only',
            },
          ],
        }),
    }),
  }),
)(ResetPasswordModal);
