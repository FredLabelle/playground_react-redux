import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header } from 'semantic-ui-react';

import { OrganizationPropType } from '../../lib/prop-types';
import { forgotPasswordMutation } from '../../lib/mutations';

class ForgotPasswordModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    organization: OrganizationPropType.isRequired,
    forgotPassword: PropTypes.func.isRequired,
  };
  state = { email: '' };
  componentWillReceiveProps({ email }) {
    this.setState({ email });
  }
  onSubmit = async event => {
    event.preventDefault();
    this.props.onClose();
    const { data: { forgotPassword } } = await this.props.forgotPassword({
      email: this.state.email,
      organizationId: this.props.organization.id,
    });
    if (forgotPassword) {
      //
    } else {
      console.error('FORGOT PASSWORD ERROR');
    }
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="small">
        <Header icon="privacy" content="Forgot password?" />
        <Modal.Content>
          <p>
            Please enter the email address you signed up with and we{"'"}ll send you a link
            to reset your password.
          </p>
          <Form id="forgot-password" onSubmit={this.onSubmit}>
            <Form.Input
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              label="Email"
              placeholder="Email"
              type="email"
              required
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="forgot-password"
            color="green"
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
