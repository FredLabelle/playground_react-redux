import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';

import { changePasswordMutation } from '../../lib/mutations';
import PasswordField from '../fields/password-field';

const initialState = { currentPassword: '', password: '', loading: false };

class ChangePasswordModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    warning: PropTypes.bool.isRequired,
    changePassword: PropTypes.func.isRequired,
  };
  state = initialState;
  onSubmit = async event => {
    event.preventDefault();
    const update = pick(this.state, 'currentPassword', 'password');
    this.setState({ loading: true });
    const { data: { changePassword } } = await this.props.changePassword(update);
    this.setState({ loading: false });
    if (changePassword) {
      toastr.success('Success!', 'Your password has been changed.');
      this.onCancel();
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
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="small">
        <Header icon="privacy" content="Change password" />
        <Modal.Content>
          <p>Change your password by typing it twice.</p>
          <Form id="change-password" onSubmit={this.onSubmit} warning={this.props.warning}>
            <Form.Input
              name="currentPassword"
              value={this.state.currentPassword}
              onChange={this.handleChange}
              label="Current password"
              placeholder="Current password"
              type="password"
              required
            />
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
            form="change-password"
            color="green"
            disabled={this.state.loading || this.props.warning}
            loading={this.state.loading}
            content="Change password"
            icon="checkmark"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  connect(({ form }) => ({ form }), null, ({ form }, dispatchProps, ownProps) => ({
    ...ownProps,
    warning: form.passwordsMismatch || form.passwordTooWeak,
  })),
  graphql(changePasswordMutation, {
    props: ({ mutate }) => ({
      changePassword: input => mutate({ variables: { input } }),
    }),
  }),
)(ChangePasswordModal);
