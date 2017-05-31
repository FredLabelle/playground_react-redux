import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Icon } from 'semantic-ui-react';

import { resetPasswordMutation } from '../../lib/mutations';

class ResetPasswordModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    token: PropTypes.string,
    resetPassword: PropTypes.func.isRequired,
  };
  static defaultProps = { token: '' };
  state = {
    password: '',
    repeatPassword: '',
  };
  onSubmit = async event => {
    event.preventDefault();
    this.props.onClose();
    const payload = {
      password: this.state.password,
      token: this.props.token,
    };
    const { data } = await this.props.resetPassword(payload);
    console.info(data.resetPassword);
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

export default graphql(resetPasswordMutation, {
  props: ({ mutate }) => ({
    resetPassword: payload => mutate({ variables: { payload } }),
  }),
})(ResetPasswordModal);
