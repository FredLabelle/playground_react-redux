import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';

import { sleep } from '../../lib/util';
import { changeEmailMutation } from '../../lib/mutations';

const initialState = { email: '', loading: false, success: false };

class ChangeEmailModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    changeEmail: PropTypes.func.isRequired,
  };
  state = initialState;
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { changeEmail } } = await this.props.changeEmail(this.state.email);
    if (changeEmail) {
      this.setState({ success: true });
      await sleep(2000);
      this.onClose();
    } else {
      console.error('CHANGE EMAIL ERROR');
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
        <Header icon="mail" content="Change email" />
        <Modal.Content>
          <p>
            Enter the new email address you want to use and we{"'"}ll send you a link to confirm you
            have access to it.
          </p>
          <Form id="change-email" onSubmit={this.onSubmit} success={this.state.success}>
            <Form.Input
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              label="Email"
              placeholder="Email"
              type="email"
              required
            />
            <Message success header="Success!" content="Your email has been changed!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="change-email"
            color="green"
            disabled={this.state.loading}
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
