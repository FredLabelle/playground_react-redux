import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';

import { sleep } from '../../lib/util';
import { changePasswordMutation } from '../../lib/mutations';
import PasswordField from '../fields/password-field';

const initialState = {
  currentPassword: '',
  password: '',
  loading: false,
  error: false,
  success: false,
};

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
    this.setState({ loading: true });
    const update = pick(this.state, 'currentPassword', 'password');
    const { data: { changePassword } } = await this.props.changePassword(update);
    if (changePassword) {
      this.setState({ error: false, success: true });
      await sleep(2000);
      this.onClose();
    } else {
      this.setState({ error: true, loading: false });
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
        <Header icon="privacy" content="Change password" />
        <Modal.Content>
          <p>Change your password by typing it twice.</p>
          <Form
            id="change-password"
            onSubmit={this.onSubmit}
            success={this.state.success}
            warning={this.props.warning}
            error={this.state.error}
          >
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
            <Message error header="Error!" content="Something went wrong!" />
            <Message success header="Success!" content="Your password has been changed!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="change-password"
            color="green"
            disabled={this.state.loading || this.props.warning}
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
