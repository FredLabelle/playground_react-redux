import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';
import { stringify } from 'querystring';

import { FRONTEND_URL } from '../../lib/env';
import { sleep, handleChange, generateInvitationEmailContent } from '../../lib/util';
import { NamePropType, OrganizationPropType } from '../../lib/prop-types';
import { inviteInvestorMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';

const InviteInvestorForm = ({ onSubmit, success, investor, onChange }) =>
  <Form id="invite-investor" onSubmit={onSubmit} success={success}>
    <NameField name="investor.name" value={investor.name} onChange={onChange} required />
    <Form.Input
      name="investor.email"
      value={investor.email}
      onChange={onChange}
      label="Email"
      placeholder="Email"
      type="email"
      required
    />
    <Message success header="Success!" content="Your invite has been sent." />
  </Form>;
InviteInvestorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  investor: PropTypes.shape({
    name: NamePropType,
    email: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

const InviteInvitationEmailForm = ({ onSubmit, success, invitationEmail, onChange }) =>
  <Form id="invite-invitation-email" onSubmit={onSubmit} success={success}>
    <Form.Input
      name="invitationEmail.subject"
      value={invitationEmail.subject}
      onChange={onChange}
      label="Subject"
      placeholder="Subject"
      required
    />
    <Form.TextArea
      name="invitationEmail.body"
      value={invitationEmail.body}
      onChange={onChange}
      label="Body"
      placeholder="Body"
      autoHeight
    />
    <Message success header="Success!" content="Your invite has been sent." />
  </Form>;
InviteInvitationEmailForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  invitationEmail: PropTypes.shape({
    subject: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

const initialState = {
  investor: {
    name: { firstName: '', lastName: '' },
    email: '',
  },
  invitationEmail: { subject: '', body: '' },
  form: 'invite-investor',
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
  onClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };
  onInvestorSubmit = event => {
    event.preventDefault();
    const user = { name: this.state.investor.name };
    const { shortId } = this.props.organization;
    const queryString = stringify({
      firstName: this.state.investor.name.firstName,
      lastName: this.state.investor.name.lastName,
      email: this.state.investor.email,
    });
    const url = `${FRONTEND_URL}/organization/${shortId}/signup?${queryString}`;
    this.setState({
      form: 'invite-invitation-email',
      invitationEmail: generateInvitationEmailContent(this.props.organization, user, url),
    });
  };
  onInvitationEmailSubmit = async event => {
    event.preventDefault();
    const newInvestor = pick(this.state, 'investor', 'invitationEmail');
    const { data: { inviteInvestor } } = await this.props.inviteInvestor(newInvestor);
    if (inviteInvestor) {
      this.setState({ success: true });
      await sleep(2000);
      this.onClose();
    } else {
      console.error('INVITE INVESTOR ERROR');
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <Modal open={this.props.open} onClose={this.onClose} size="small">
        <Header icon="mail" content="Invite investor by mail" />
        <Modal.Content>
          {this.state.form === 'invite-investor'
            ? <InviteInvestorForm
                onSubmit={this.onInvestorSubmit}
                success={this.state.success}
                investor={this.state.investor}
                onChange={this.handleChange}
              />
            : <InviteInvitationEmailForm
                onSubmit={this.onInvitationEmailSubmit}
                success={this.state.success}
                invitationEmail={this.state.invitationEmail}
                onChange={this.handleChange}
              />}
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            onClick={this.onClose}
            content="Cancel"
            icon="remove"
            labelPosition="left"
          />
          <Button
            type="submit"
            form={this.state.form}
            color="green"
            disabled={this.state.success}
            content={this.state.form === 'invite-investor' ? 'Continue' : 'Send invite'}
            icon={this.state.form === 'invite-investor' ? 'checkmark' : 'mail'}
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
