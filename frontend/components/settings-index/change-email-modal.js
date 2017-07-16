import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';

import { changeEmailMutation } from '../../lib/mutations';

const initialState = { password: '', email: '', loading: false };

class ChangeEmailModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
  };
  state = initialState;
  onSubmit = async event => {
    event.preventDefault();
    const update = pick(this.state, 'password', 'email');
    this.setState({ loading: true });
    const { data: { changeEmail } } = await this.props.changeEmail(update);
    this.setState({ loading: false });
    if (changeEmail) {
      toastr.success('Success!', 'Your email has been changed.');
      this.onClose();
    } else {
      toastr.error('Error!', 'Something went wrong.');
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
          <Form id="change-email" onSubmit={this.onSubmit}>
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
            disabled={this.state.loading}
            loading={this.state.loading}
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
