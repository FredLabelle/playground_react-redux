import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';

import { InvestorPropType, OrganizationPropType } from '../../lib/prop-types';
import { sleep, omitDeep, handleChange } from '../../lib/util';
import { sendInvitationMutation, inviteInvestorMutation } from '../../lib/mutations';
import InvitationEmailFields from '../common/invitation-email-fields';

const initialState = ({ parametersSettings }) => ({
  invitationEmail: parametersSettings.invitationEmail,
  success: false,
  warning: false,
});

class SendInvitationModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    investor: InvestorPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    sendInvitation: PropTypes.func.isRequired,
    inviteInvestor: PropTypes.func.isRequired,
  };
  state = initialState(this.props.organization);
  onCancel = () => {
    this.setState(initialState(this.props.organization));
    this.props.onClose();
  };
  onSubmit = async event => {
    event.preventDefault();
    const { body } = this.state.invitationEmail;
    const warning = !body.includes('{{signup_link}}');
    this.setState({ warning });
    if (warning) {
      return;
    }
    const { investor, sendInvitation, inviteInvestor } = this.props;
    const mutation = investor.status === 'created' ? sendInvitation : inviteInvestor;
    const mutationName = investor.status === 'created' ? 'sendInvitation' : 'inviteInvestor';
    const { data } = await mutation({
      investor: omitDeep(pick(investor, 'email', 'name'), '__typename'),
      invitationEmail: omitDeep(this.state.invitationEmail, '__typename'),
    });
    if (data[mutationName]) {
      this.setState({ success: true });
      await sleep(2000);
      this.onCancel();
    } else {
      console.error('SEND INVITATION ERROR');
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    const action = this.props.investor.status === 'invited' ? 'Resend' : 'Send';
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="small">
        <Header icon="mail" content={`${action} invitation by email`} />
        <Modal.Content>
          <Form
            id="send-invitation"
            onSubmit={this.onSubmit}
            warning={this.state.warning}
            success={this.state.success}
          >
            <InvitationEmailFields
              invitationEmail={this.state.invitationEmail}
              handleChange={this.handleChange}
            />
            <Message
              warning
              header="Warning!"
              content="You must include {{signup_link}} in the body!"
            />
            <Message success header="Success!" content="Your invite has been sent." />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            onClick={this.onCancel}
            content="Cancel"
            icon="remove"
            labelPosition="left"
          />
          <Button
            type="submit"
            form="send-invitation"
            color="green"
            disabled={this.state.success}
            content={`${action} invitation`}
            icon="checkmark"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  graphql(sendInvitationMutation, {
    props: ({ mutate }) => ({
      sendInvitation: input =>
        mutate({
          variables: { input },
        }),
    }),
  }),
  graphql(inviteInvestorMutation, {
    props: ({ mutate }) => ({
      inviteInvestor: input =>
        mutate({
          variables: { input },
        }),
    }),
  }),
)(SendInvitationModal);
