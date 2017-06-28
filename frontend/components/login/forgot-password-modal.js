import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';

import { sleep } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import { forgotPasswordMutation } from '../../lib/mutations';

const initialState = { email: '', loading: false, success: false };

class ForgotPasswordModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    organization: OrganizationPropType.isRequired,
    forgotPassword: PropTypes.func.isRequired,
  };
  state = initialState;
  componentWillReceiveProps({ email }) {
    this.setState({ email });
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { forgotPassword } } = await this.props.forgotPassword({
      email: this.state.email,
      organizationId: this.props.organization.id,
    });
    if (forgotPassword) {
      this.setState({ success: true });
      await sleep(2000);
      this.onClose();
    } else {
      console.error('FORGOT PASSWORD ERROR');
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
        <Header icon="privacy" content="Forgot password?" />
        <Modal.Content>
          <p>
            Please enter the email address you signed up with and we{"'"}ll send you a link to reset
            your password.
          </p>
          <Form id="forgot-password" onSubmit={this.onSubmit} success={this.state.success}>
            <Form.Input
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              label="Email"
              placeholder="Email"
              type="email"
              required
            />
            <Message success header="Success!" content="Forgot password request sent!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="forgot-password"
            color="green"
            disabled={this.state.loading}
            content="Send email"
            icon="mail"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default graphql(forgotPasswordMutation, {
  props: ({ mutate }) => ({
    forgotPassword: input => mutate({ variables: { input } }),
  }),
})(ForgotPasswordModal);
