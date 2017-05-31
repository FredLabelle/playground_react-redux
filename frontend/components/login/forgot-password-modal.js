import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Icon } from 'semantic-ui-react';

import { forgotPasswordMutation } from '../../lib/mutations';

class ForgotPasswordModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    organizationShortId: PropTypes.string.isRequired,
    forgotPassword: PropTypes.func.isRequired,
  };
  state = { email: '' };
  componentWillReceiveProps({ email }) {
    this.setState({ email });
  }
  onSubmit = async event => {
    event.preventDefault();
    this.props.onClose();
    const payload = {
      email: this.state.email,
      organizationShortId: this.props.organizationShortId,
    };
    const { data } = await this.props.forgotPassword(payload);
    console.info(data.forgotPassword);
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="small"
      >
        <Header icon="privacy" content="Forgot password?" />
        <Modal.Content>
          <p>
            Please enter the email address you signed up with and we&apos;ll send you a link
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
          <Button color="green" form="forgot-password">
            <Icon name="mail" /> Send email
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const ForgotPasswordModalWithGraphQL = graphql(forgotPasswordMutation, {
  props: ({ mutate }) => ({
    forgotPassword: payload => mutate({ variables: { payload } }),
  }),
})(ForgotPasswordModal);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(ForgotPasswordModalWithGraphQL);
