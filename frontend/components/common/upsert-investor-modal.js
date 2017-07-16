import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Modal, Header, Form, Message, Button } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';

import { handleChange, omitDeep } from '../../lib/util';
import { InvestorPropType, OrganizationPropType } from '../../lib/prop-types';
import { investorsQuery } from '../../lib/queries';
import { invitationStatusMutation, upsertInvestorMutation } from '../../lib/mutations';
import AccountFields from './account-fields';
import AdministrativeFields from './administrative-fields';

const initialState = ({ investor }) => ({
  investor: pick(investor, [
    'id',
    'email',
    'phone',
    'name',
    'investmentSettings',
    'type',
    'individualSettings',
    'corporationSettings',
    'advisor',
  ]),
  createdWarning: false,
  invitedWarning: false,
  joinedWarning: false,
  investmentSettingsError: false,
  loading: false,
});

class UpsertInvestorModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    investor: InvestorPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    upsertInvestor: PropTypes.func.isRequired,
  };
  state = initialState(this.props);
  onCancel = () => {
    this.setState(initialState(this.props));
    this.props.onClose();
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { invitationStatus } } = await this.props.invitationStatus({
      email: this.state.investor.email,
      organizationId: this.props.organization.id,
    });
    const createdWarning = !this.props.investor.id && invitationStatus === 'created';
    const invitedWarning = !this.props.investor.id && invitationStatus === 'invited';
    const joinedWarning = !this.props.investor.id && invitationStatus === 'joined';
    this.setState({ createdWarning, invitedWarning, joinedWarning });
    if (createdWarning || invitedWarning || joinedWarning) {
      this.setState({ loading: false });
      return;
    }
    const investor = omitDeep(this.state.investor, '__typename');
    const { data: { upsertInvestor } } = await this.props.upsertInvestor(investor);
    this.setState({ loading: false });
    if (upsertInvestor) {
      const message = this.props.investor.id ? 'Investor updated.' : 'Investor created.';
      toastr.success('Success!', message);
      this.props.onClose();
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    const { createdWarning, invitedWarning, joinedWarning } = this.state;
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="fullscreen">
        <Header
          icon="user"
          content={this.props.investor.id ? 'Edit investor' : 'Create a new investor'}
        />
        <Modal.Content>
          <Form
            id="upsert-investor"
            onSubmit={this.onSubmit}
            warning={createdWarning || invitedWarning || joinedWarning}
          >
            <Header as="h2" dividing>
              Account
            </Header>
            <AccountFields
              investor={this.state.investor}
              handleChange={this.handleChange}
              organization={this.props.organization}
            />
            <Header as="h2" dividing>
              Administrative details
            </Header>
            <AdministrativeFields investor={this.state.investor} handleChange={this.handleChange} />
            {createdWarning &&
              <Message warning header="Warning!" content="This user has already been invited!" />}
            {invitedWarning &&
              <Message warning header="Warning!" content="This user has already been invited!" />}
            {joinedWarning &&
              <Message warning header="Warning!" content="This user has already joined!" />}
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
            form="upsert-investor"
            primary
            disabled={this.state.loading}
            loading={this.state.loading}
            content={this.props.investor.id ? 'Update' : 'Create'}
            icon="checkmark"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(invitationStatusMutation, {
    props: ({ mutate }) => ({
      invitationStatus: input => mutate({ variables: { input } }),
    }),
  }),
  graphql(upsertInvestorMutation, {
    props: ({ mutate }) => ({
      upsertInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: investorsQuery }],
        }),
    }),
  }),
)(UpsertInvestorModal);
