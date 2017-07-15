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
import { upsertInvestorMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';
import FilesField from '../fields/files-field';
import InvestmentField from '../fields/investment-field';
import ChangeEmailModal from './change-email-modal';
import ChangePasswordModal from './change-password-modal';

const accountFields = ['id', 'name', 'phone', 'picture', 'investmentSettings'];

class SettingsAccount extends Component {
  static propTypes = {
    form: FormPropType.isRequired,
    me: MePropType,
    organization: OrganizationPropType.isRequired,
    upsertInvestor: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { me: null };
  state = {
    me: pick(this.props.me, accountFields),
    investmentSettingsError: false,
    saving: false,
    saved: false,
    changeEmailModalOpen: false,
    changePasswordModalOpen: false,
  };
  componentDidMount() {
    const inputs = [...document.querySelectorAll('[type="email"], [type="password"]')];
    inputs.forEach(input => Object.assign(input, { disabled: true }));
  }
  onChangeEmailModalClose = () => {
    this.setState({ changeEmailModalOpen: false });
  };
  onChangePasswordModalClose = () => {
    this.setState({ changePasswordModalOpen: false });
  };
  onSubmit = async event => {
    event.preventDefault();
    const { investmentSettings } = this.state.me;
    const investmentSettingsError = Object.values(investmentSettings).length === 0;
    this.setState({ investmentSettingsError });
    if (investmentSettingsError) {
      return;
    }
    this.setState({ saving: true });
    const { data: { upsertInvestor } } = await this.props.upsertInvestor(this.update());
    this.setState({ saving: false });
    if (upsertInvestor) {
      this.props.setUnsavedChanges(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = handleChange(() => {
    const me = pick(this.props.me, accountFields);
    const meOmitted = omitDeep(me, '__typename');
    const unsavedChanges = !isEqual(this.update(), meOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  update = () => omitDeep(this.state.me, '__typename');
  changeEmail = event => {
    event.preventDefault();
    this.setState({ changeEmailModalOpen: true });
  };
  changePassword = event => {
    event.preventDefault();
    this.setState({ changePasswordModalOpen: true });
  };
  render() {
    if (!this.props.me || !this.props.organization) {
      return null;
    }
    const { dealCategories, parametersSettings } = this.props.organization;
    const { defaultCurrency, optOutTime } = parametersSettings.investmentMechanisms;
    return (
      <Segment attached="bottom" className="tab active">
        <Form
          onSubmit={this.onSubmit}
          success={this.state.success}
          error={this.state.investmentSettingsError}
        >
          <Header as="h3" dividing>
            Investor identity
          </Header>
          <NameField name="me.name" value={this.state.me.name} onChange={this.handleChange} />
          <Form.Input
            name="me.phone"
            value={this.state.me.phone}
            onChange={this.handleChange}
            label="Phone"
            placeholder="Phone"
            type="tel"
          />
          <Form.Input
            defaultValue={this.props.me.email}
            label="Email"
            action={{ type: 'button', content: 'Change it?', onClick: this.changeEmail }}
            type="email"
          />
          <Form.Input
            defaultValue="password"
            label="Password"
            action={{ type: 'button', content: 'Change it?', onClick: this.changePassword }}
            type="password"
          />
          <FilesField
            name="me.picture"
            value={this.state.me.picture}
            onChange={this.handleChange}
            label="Profile picture"
            imagesOnly
            tabs={['camera', 'file', 'gdrive', 'dropbox', 'url']}
            crop="192x192 upscale"
          />
          <Header as="h3" dividing>
            Investment methods & criteria
          </Header>
          <p>
            For <strong>Systematic with opt-out</strong>, the opt-out time is {optOutTime} days.
          </p>
          <InvestmentField
            name="me.investmentSettings"
            value={this.state.me.investmentSettings}
            onChange={this.handleChange}
            dealCategories={dealCategories}
            defaultCurrency={defaultCurrency}
          />
          <Message error header="Error!" content="You must chose at least one investment method." />
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
        <ChangePasswordModal
          open={this.state.changePasswordModalOpen}
          onClose={this.onChangePasswordModalClose}
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
  graphql(upsertInvestorMutation, {
    props: ({ mutate }) => ({
      upsertInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(SettingsAccount);
