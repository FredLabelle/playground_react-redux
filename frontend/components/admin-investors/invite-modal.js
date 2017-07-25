import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';

import { handleChange, omitDeep } from '../../lib/util';
import { NamePropType, OrganizationPropType } from '../../lib/prop-types';
import invitationStatusMutation from '../../graphql/mutations/invitation-status.gql';
import inviteInvestorMutation from '../../graphql/mutations/invite-investor.gql';
import investorsQuery from '../../graphql/queries/investors.gql';
import NameField from '../fields/name-field';
import InvitationEmailFields from '../common/invitation-email-fields';

const InviteInvestorForm = ({ onSubmit, investor, onChange, createdWarning, joinedWarning }) =>
  <Form id="invite-investor" onSubmit={onSubmit} warning={createdWarning || joinedWarning}>
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
    {createdWarning &&
      <Message warning header="Warning!" content="This user is already created!" />}
    {joinedWarning && <Message warning header="Warning!" content="This user has already joined!" />}
  </Form>;
InviteInvestorForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  investor: PropTypes.shape({
    name: NamePropType,
    email: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  createdWarning: PropTypes.bool.isRequired,
  joinedWarning: PropTypes.bool.isRequired,
};

const InviteInvitationEmailForm = ({ onSubmit, invitationEmail, onChange, info, warning }) =>
  <Form id="invite-invitation-email" onSubmit={onSubmit} warning={warning}>
    {info &&
      <Message
        info
        header="Information!"
        content="This user has already been invited, send a reminder email?"
      />}
    <InvitationEmailFields invitationEmail={invitationEmail} handleChange={onChange} />
    <Message warning header="Warning!" content="You must include {{signup_link}} in the body!" />
  </Form>;
InviteInvitationEmailForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  invitationEmail: PropTypes.shape({
    subject: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  info: PropTypes.bool.isRequired,
  warning: PropTypes.bool.isRequired,
};

const initialState = ({ parametersSettings }) => ({
  investor: {
    name: { firstName: '', lastName: '' },
    email: '',
  },
  invitationEmail: parametersSettings.invitationEmail,
  form: 'invite-investor',
  loading: false,
  info: false,
  createdWarning: false,
  joinedWarning: false,
  invitationEmailWarning: false,
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
    this.setState({ loading: true });
    const { data: { invitationStatus } } = await this.props.invitationStatus({
      email: this.state.investor.email,
      organizationId: this.props.organization.id,
    });
    this.setState({ loading: false });
    if (invitationStatus === 'invitable' || invitationStatus === 'invited') {
      this.setState({
        form: 'invite-invitation-email',
        info: invitationStatus === 'invited',
      });
    } else {
      if (invitationStatus === 'error') {
        toastr.error('Error!', 'Something went wrong with your invite.');
      }
      this.setState({
        createdWarning: invitationStatus === 'created',
        joinedWarning: invitationStatus === 'joined',
      });
    }
  };
  onInvitationEmailSubmit = async event => {
    event.preventDefault();
    const { body } = this.state.invitationEmail;
    const invitationEmailWarning = !body.includes('{{signup_link}}');
    this.setState({ invitationEmailWarning });
    if (invitationEmailWarning) {
      return;
    }
    const newInvestor = pick(this.state, 'investor', 'invitationEmail');
    const newInvestorOmitted = omitDeep(newInvestor, '__typename');
    this.setState({ loading: true });
    const { data: { inviteInvestor } } = await this.props.inviteInvestor(newInvestorOmitted);
    this.setState({ loading: false });
    if (inviteInvestor) {
      const message = this.state.info
        ? 'Your reminder has been sent.'
        : 'Your invite has been sent.';
      toastr.success('Success!', message);
      this.onCancel();
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    const sendCaption = this.state.info ? 'Send reminder' : 'Send invite';
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="small">
        <Header icon="mail" content="Invite investor by mail" />
        <Modal.Content>
          {this.state.form === 'invite-investor'
            ? <InviteInvestorForm
                onSubmit={this.onInvestorSubmit}
                investor={this.state.investor}
                onChange={this.handleChange}
                createdWarning={this.state.createdWarning}
                joinedWarning={this.state.joinedWarning}
              />
            : <InviteInvitationEmailForm
                onSubmit={this.onInvitationEmailSubmit}
                invitationEmail={this.state.invitationEmail}
                onChange={this.handleChange}
                info={this.state.info}
                warning={this.state.invitationEmailWarning}
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
            disabled={this.state.loading}
            loading={this.state.loading}
            content={this.state.form === 'invite-investor' ? 'Continue' : sendCaption}
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
