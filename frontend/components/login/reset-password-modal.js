import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Button, Form, Modal, Header } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import Router from 'next/router';

import { RouterPropType } from '../../lib/prop-types';
import { resetPasswordMutation } from '../../lib/mutations';
import { userQuery } from '../../lib/queries';
import PasswordField from '../fields/password-field';

const initialState = { password: '', loading: false };

class ResetPasswordModal extends Component {
  static propTypes = {
    warning: PropTypes.bool.isRequired,
    router: RouterPropType.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
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
    this.setState({ loading: false });
    if (resetPassword) {
      this.props.cookies.set('token', resetPassword, { path: '/' });
      toastr.success('Success!', 'Your password has been reset.');
      const route = this.props.router.query.invited === 'true' ? '/settings/administrative' : '/';
      Router.push(route, route);
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  onCancel = () => {
    this.setState(initialState);
    this.props.onClose();
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    const wording = this.props.router.query.invited === 'true' ? 'Set' : 'Reset';
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="small">
        <Header icon="privacy" content={`${wording} your password`} />
        <Modal.Content>
          <p>
            {wording} your password by typing it twice.
          </p>
          <Form id="reset-password" onSubmit={this.onSubmit} warning={this.props.warning}>
            <PasswordField
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            content="Cancel"
            icon="remove"
            labelPosition="left"
            onClick={this.onCancel}
          />
          <Button
            type="submit"
            form="reset-password"
            color="green"
            disabled={this.state.loading || this.props.warning}
            loading={this.state.loading}
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
              query: userQuery,
              fetchPolicy: 'network-only',
            },
          ],
        }),
    }),
  }),
)(ResetPasswordModal);
