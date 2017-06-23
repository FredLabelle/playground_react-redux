import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';

import { sleep } from '../../lib/util';
import { changePasswordMutation } from '../../lib/mutations';
import PasswordField from '../fields/password-field';

const initialState = { password: '', loading: false, success: false };

class ChangePasswordModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    changePassword: PropTypes.func.isRequired,
  };
  state = initialState;
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { changePassword } } = await this.props.changePassword(this.state.password);
    if (changePassword) {
      this.setState({ success: true });
      await sleep(2000);
      this.onClose();
    } else {
      console.error('CHANGE PASSWORD ERROR');
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
        <Header icon="privacy" content="Change password" />
        <Modal.Content>
          <p>Change your password by typing it twice.</p>
          <Form
            id="change-password"
            onSubmit={this.onSubmit}
            success={this.state.success}
            error={this.props.error}
          >
            <PasswordField
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <Message success header="Success!" content="Your password has been changed!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="change-password"
            color="green"
            disabled={this.state.loading || this.props.error}
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
  connect(({ form }) => ({ form }), null, ({ form }, dispatchProps, ownProps) => {
    const error = form.passwordsMismatch || form.passwordTooWeak;
    return Object.assign({ error }, ownProps);
  }),
  graphql(changePasswordMutation, {
    props: ({ mutate }) => ({
      changePassword: input => mutate({ variables: { input } }),
    }),
  }),
)(ChangePasswordModal);
