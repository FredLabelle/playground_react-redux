import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';

import { sleep, handleChange } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import { inviteInvestorMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';

const initialState = {
  investor: {
    name: { firstName: '', lastName: '' },
    email: '',
  },
  success: false,
};

class InviteModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    organization: OrganizationPropType.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    inviteInvestor: PropTypes.func.isRequired,
  };
  state = initialState;
  onSubmit = async event => {
    event.preventDefault();
    event.persist();
    const { data: { inviteInvestor } } = await this.props.inviteInvestor({
      ...this.state.investor,
      organizationId: this.props.organization.id,
    });
    if (inviteInvestor) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState(initialState);
      this.props.onClose();
    } else {
      console.error('INVITE INVESTOR ERROR');
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="small">
        <Header icon="mail" content="Invite investor by mail" />
        <Modal.Content>
          <Form id="invite" onSubmit={this.onSubmit} success={this.state.success}>
            <NameField
              name="investor.name"
              value={this.state.investor.name}
              onChange={this.handleChange}
              required
            />
            <Form.Input
              name="investor.email"
              value={this.state.investor.email}
              onChange={this.handleChange}
              label="Email"
              placeholder="Email"
              type="email"
              required
            />
            <Message success header="Success!" content="Your invite has been sent." />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="invite"
            color="green"
            content="Send invite"
            icon="mail"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default graphql(inviteInvestorMutation, {
  props: ({ mutate }) => ({
    inviteInvestor: input => mutate({ variables: { input } }),
  }),
})(InviteModal);
