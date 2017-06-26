import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { NamePropType, OrganizationPropType } from '../../lib/prop-types';
import { invitationStatusMutation, inviteInvestorMutation } from '../../lib/mutations';
import { investorsQuery } from '../../lib/queries';
import NameField from '../fields/name-field';

const InviteInvestorForm = ({ onSubmit, investor, onChange, warning, error }) =>
  <Form id="invite-investor" onSubmit={onSubmit} warning={warning} error={error}>
    <Form.Input
      name="investor.email"
      value={investor.email}
      onChange={onChange}
      label="Email"
      placeholder="Email"
      type="email"
      required
    />
    <NameField name="investor.name" value={investor.name} onChange={onChange} />
    <Message warning header="Warning!" content="This user has already joined!" />
    <Message error header="Error!" content="Something went wrong with your invite!" />
  </Form>;
InviteInvestorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  investor: PropTypes.shape({
    name: NamePropType,
    email: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
};

const InviteInvitationEmailForm = ({ onSubmit, invitationEmail, onChange, success, info, error }) =>
  <Form id="invite-invitation-email" onSubmit={onSubmit} success={success} error={error}>
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
      required
      autoHeight
    />
    <p>
      You can use <strong>{'{{organization}}'}</strong>,{' '}
      <strong>{'{{firstname}}'}</strong>, <strong>{'{{lastname}}'}</strong>{' '}
      and <strong>{'{{url}}'}</strong>.
    </p>
    {info &&
      <Message
        info
        header="Information!"
        content="This user has already been invited, send a reminder email?"
      />}
    <Message success header="Success!" content="Your invite has been sent." />
    <Message error header="Error!" content="Something went wrong with your invite!" />
  </Form>;
InviteInvitationEmailForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  invitationEmail: PropTypes.shape({
    subject: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  info: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
};

const initialState = organization => ({
  investor: {
    name: { firstName: '', lastName: '' },
    email: '',
  },
  invitationEmail: organization.parametersSettings.invitationEmail,
  form: 'invite-investor',
  success: false,
  info: false,
  warning: false,
  error: false,
});

class InviteModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    organization: OrganizationPropType.isRequired,
    invitationStatus: PropTypes.func.isRequired,
    inviteInvestor: PropTypes.func.isRequired,
  };
  state = initialState(this.props.organization);
  onCancel = () => {
    this.setState(initialState(this.props.organization));
    this.props.onClose();
  };
  onBack = () => {
    this.setState({ form: 'invite-investor' });
  };
  onInvestorSubmit = async event => {
    event.preventDefault();
    const { email } = this.state.investor;
    const { data: { invitationStatus } } = await this.props.invitationStatus(email);
    if (invitationStatus === 'invitable' || invitationStatus === 'invited') {
      this.setState({
        form: 'invite-invitation-email',
        info: invitationStatus === 'invited',
      });
    } else {
      this.setState({
        warning: invitationStatus === 'joined',
        error: invitationStatus === 'error',
      });
    }
  };
  onInvitationEmailSubmit = async event => {
    event.preventDefault();
    const newInvestor = pick(this.state, 'investor', 'invitationEmail');
    const newInvestorOmitted = omitDeep(newInvestor, '__typename');
    const { data: { inviteInvestor } } = await this.props.inviteInvestor(newInvestorOmitted);
    const state = inviteInvestor ? 'success' : 'error';
    this.setState({ [state]: true });
    await sleep(2000);
    this.onCancel();
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="small">
        <Header icon="mail" content="Invite investor by mail" />
        <Modal.Content>
          {this.state.form === 'invite-investor'
            ? <InviteInvestorForm
                onSubmit={this.onInvestorSubmit}
                investor={this.state.investor}
                onChange={this.handleChange}
                warning={this.state.warning}
                error={this.state.error}
              />
            : <InviteInvitationEmailForm
                onSubmit={this.onInvitationEmailSubmit}
                invitationEmail={this.state.invitationEmail}
                onChange={this.handleChange}
                info={this.state.info}
                success={this.state.success}
                error={this.state.error}
              />}
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            onClick={this.state.form === 'invite-investor' ? this.onCancel : this.onBack}
            content={this.state.form === 'invite-investor' ? 'Cancel' : 'Back'}
            icon={this.state.form === 'invite-investor' ? 'remove' : 'arrow left'}
            labelPosition="left"
          />
          <Button
            type="submit"
            form={this.state.form}
            color="green"
            disabled={this.state.error || this.state.success}
            content={this.state.form === 'invite-investor' ? 'Continue' : 'Send invite'}
            icon={this.state.form === 'invite-investor' ? 'checkmark' : 'mail'}
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  graphql(invitationStatusMutation, {
    props: ({ mutate }) => ({
      invitationStatus: input => mutate({ variables: { input } }),
    }),
  }),
  graphql(inviteInvestorMutation, {
    props: ({ mutate }) => ({
      inviteInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: investorsQuery }],
        }),
    }),
  }),
)(InviteModal);
