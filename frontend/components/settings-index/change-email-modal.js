import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header } from 'semantic-ui-react';

import { changeEmailMutation } from '../../lib/mutations';

class ChangeEmailModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
  };
  state = { email: '' };
  onSubmit = async event => {
    event.preventDefault();
    this.props.onClose();
    const { data: { changeEmail } } = await this.props.changeEmail(this.state.email);
    if (changeEmail) {
      //
    } else {
      console.error('CHANGE EMAIL ERROR');
    }
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="small">
        <Header icon="mail" content="Change email" />
        <Modal.Content>
          <p>
            Enter the new email address you want to use and we{"'"}ll send you a link
            to confirm you have access to it.
          </p>
          <Form id="change-email" onSubmit={this.onSubmit}>
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
            form="change-email"
            color="green"
            content="Change email"
            icon="mail"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default graphql(changeEmailMutation, {
  props: ({ mutate }) => ({
    changeEmail: input => mutate({ variables: { input } }),
  }),
})(ChangeEmailModal);
