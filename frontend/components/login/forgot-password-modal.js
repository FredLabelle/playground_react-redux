import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';

import { OrganizationPropType } from '../../lib/prop-types';
import forgotPasswordMutation from '../../graphql/mutations/forgot-password.gql';

const initialState = { email: '', loading: false };

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
    this.setState({ loading: false });
    if (forgotPassword) {
      toastr.success('Success!', 'Forgot password request sent!');
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
        <Header icon="privacy" content="Forgot password?" />
        <Modal.Content>
          <p>
            Please enter the email address you signed up with and we{"'"}ll send you a link to reset
            your password.
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
            type="button"
            color="red"
            content="Cancel"
            icon="remove"
            labelPosition="left"
            onClick={this.onCancel}
          />
          <Button
            type="submit"
            form="forgot-password"
            color="green"
            disabled={this.state.loading}
            loading={this.state.loading}
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
