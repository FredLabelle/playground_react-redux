import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Form, Header, Button, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { sleep, omitDeep, handleChange } from '../../lib/util';
import { FormPropType, MePropType, OrganizationPropType } from '../../lib/prop-types';
import { setUnsavedChanges } from '../../actions/form';
import { meQuery, organizationQuery } from '../../lib/queries';
import { updateInvestorMutation, updateInvestorFileMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';
import FileField from '../fields/file-field';
import CheckboxesField from '../fields/checkboxes-field';
import AmountField from '../fields/amount-field';
import MechanismField from '../fields/mechanism-field';
import ChangeEmailModal from './change-email-modal';

class SettingsAccount extends Component {
  static propTypes = {
    form: FormPropType.isRequired,
    me: MePropType,
    organization: OrganizationPropType.isRequired,
    updateInvestor: PropTypes.func.isRequired,
    updateInvestorFile: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { me: null };
  state = {
    me: {
      ...pick(this.props.me, 'name', 'picture', 'investmentSettings'),
    },
    saving: false,
    saved: false,
    changeEmailModalOpen: false,
  };
  componentDidMount() {
    const email = document.querySelector('[type="email"]');
    if (email) {
      email.disabled = true;
    }
  }
  onChangeEmailModalClose = () => {
    this.setState({ changeEmailModalOpen: false });
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor(this.update());
    this.setState({ saving: false });
    if (updateInvestor) {
      this.props.setUnsavedChanges(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = handleChange(() => {
    const me = pick(this.props.me, 'name', 'investmentSettings');
    const meOmitted = omitDeep(me, '__typename');
    const unsavedChanges = !isEqual(this.update(), meOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  update = () => omitDeep(this.state.me, 'picture', '__typename');
  changeEmail = event => {
    event.preventDefault();
    this.setState({ changeEmailModalOpen: true });
  };
  render() {
    return (
      this.props.me &&
      <Segment attached="bottom" className="tab active">
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <Header as="h3" dividing>Investor identity</Header>
          <NameField name="me.name" value={this.state.me.name} onChange={this.handleChange} />
          <Form.Input
            defaultValue={this.props.me.email}
            label="Email"
            action={{ type: 'button', content: 'Change it?', onClick: this.changeEmail }}
            type="email"
          />
          <FileField
            field="picture"
            label="Profile picture"
            file={this.state.me.picture}
            mutation={this.props.updateInvestorFile}
            mutationName="updateInvestorFile"
            imagesOnly
            tabs={['camera', 'file', 'gdrive', 'dropbox', 'url']}
            crop="192x192 upscale"
          />
          <Header as="h3" dividing>Investor profile</Header>
          <CheckboxesField
            name="me.investmentSettings.dealCategories"
            value={this.state.me.investmentSettings.dealCategories}
            onChange={this.handleChange}
            checkboxes={this.props.organization.parametersSettings.investment.dealCategories}
            label="Deal categories interested in"
          />
          <AmountField
            name="me.investmentSettings.averageTicket"
            value={this.state.me.investmentSettings.averageTicket}
            onChange={this.handleChange}
            label="Average ticket"
          />
          <MechanismField
            name="me.investmentSettings.mechanism"
            value={this.state.me.investmentSettings.mechanism}
            onChange={this.handleChange}
            label="Investment mechanism interested in"
          />
          <Message success header="Success!" content="Your changes have been saved." />
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.saving || !this.props.form.unsavedChanges}
              content={this.state.saving ? 'Saving…' : 'Save'}
              icon="save"
              labelPosition="left"
            />
          </Segment>
        </Form>
        <ChangeEmailModal
          open={this.state.changeEmailModalOpen}
          onClose={this.onChangeEmailModalClose}
        />
      </Segment>
    );
  }
}

export default compose(
  connect(({ router, form }) => ({ router, form }), { setUnsavedChanges }),
  graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(updateInvestorMutation, {
    props: ({ mutate }) => ({
      updateInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
  graphql(updateInvestorFileMutation, {
    props: ({ mutate }) => ({
      updateInvestorFile: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(SettingsAccount);
