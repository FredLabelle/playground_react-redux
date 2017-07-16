import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';

import { InvestorPropType, OrganizationPropType } from '../../lib/prop-types';
import { omitDeep, handleChange } from '../../lib/util';
import { sendInvitationMutation, inviteInvestorMutation } from '../../lib/mutations';
import InvitationEmailFields from '../common/invitation-email-fields';

const initialState = ({ parametersSettings }) => ({
  invitationEmail: parametersSettings.invitationEmail,
  loading: false,
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
    this.setState({ loading: true });
    const { data } = await mutation({
      investor: omitDeep(pick(investor, 'email', 'name'), '__typename'),
      invitationEmail: omitDeep(this.state.invitationEmail, '__typename'),
    });
    this.setState({ loading: false });
    if (data[mutationName]) {
      toastr.success('Success!', 'Your invite has been sent.');
      this.onCancel();
    } else {
      toastr.error('Error!', 'Something went wrong with your invite.');
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    const action = this.props.investor.status === 'invited' ? 'Resend' : 'Send';
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="small">
        <Header icon="mail" content={`${action} invitation by email`} />
        <Modal.Content>
          <Form id="send-invitation" onSubmit={this.onSubmit} warning={this.state.warning}>
            <InvitationEmailFields
              invitationEmail={this.state.invitationEmail}
              handleChange={this.handleChange}
            />
            <Message
              warning
              header="Warning!"
              content="You must include {{signup_link}} in the body!"
            />
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
            disabled={this.state.loading}
            loading={this.state.loading}
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
