import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Form, Header, Button } from 'semantic-ui-react';
import Router from 'next/router';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { omitDeep, handleChange } from '../../lib/util';
import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType, InvestorPropType, OrganizationPropType } from '../../lib/prop-types';
import { setUnsavedChanges } from '../../actions/form';
import { investorQuery, organizationQuery } from '../../lib/queries';
import { upsertInvestorMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';
import FilesField from '../fields/files-field';
import InvestmentField from '../fields/investment-field';
import ChangeEmailModal from './change-email-modal';
import ChangePasswordModal from './change-password-modal';

const accountFields = ['id', 'name', 'phone1', 'phone2', 'picture', 'investmentSettings'];

class SettingsAccount extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    investor: InvestorPropType,
    organization: OrganizationPropType.isRequired,
    upsertInvestor: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { investor: null };
  state = {
    investor: pick(this.props.investor, accountFields),
    loading: false,
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
    this.setState({ loading: true });
    const { data: { upsertInvestor } } = await this.props.upsertInvestor(this.update());
    this.setState({ loading: false });
    if (upsertInvestor) {
      this.props.setUnsavedChanges(false);
      toastr.success('Success!', 'Your changes have been saved.');
      if (this.props.router.query.invited === 'true') {
        const router = { ...this.props.router };
        delete router.query.invited;
        Router.push(linkHref('/', router), linkAs('/', router));
      }
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  handleChange = handleChange(() => {
    const investor = pick(this.props.investor, accountFields);
    const investorOmitted = omitDeep(investor, '__typename');
    const unsavedChanges = !isEqual(this.update(), investorOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  update = () => omitDeep(this.state.investor, '__typename');
  changeEmail = event => {
    event.preventDefault();
    this.setState({ changeEmailModalOpen: true });
  };
  changePassword = event => {
    event.preventDefault();
    this.setState({ changePasswordModalOpen: true });
  };
  render() {
    if (!this.props.investor || !this.props.organization) {
      return null;
    }
    const { dealCategories, parametersSettings } = this.props.organization;
    const { defaultCurrency, optOutTime } = parametersSettings.investmentMechanisms;
    return (
      <Segment attached="bottom" className="tab active">
        <Form onSubmit={this.onSubmit}>
          <Header as="h3" dividing>
            Investor identity
          </Header>
          <NameField
            name="investor.name"
            value={this.state.investor.name}
            onChange={this.handleChange}
          />
          <Form.Group>
            <Form.Input
              name="investor.phone1"
              value={this.state.investor.phone1}
              onChange={this.handleChange}
              label="Phone 1"
              placeholder="Phone 1"
              type="tel"
              width={8}
            />
            <Form.Input
              name="investor.phone2"
              value={this.state.investor.phone2}
              onChange={this.handleChange}
              label="Phone 2"
              placeholder="Phone 2"
              type="tel"
              width={8}
            />
          </Form.Group>
          <Form.Input
            defaultValue={this.props.investor.email}
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
            name="investor.picture"
            value={this.state.investor.picture}
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
            name="investor.investmentSettings"
            value={this.state.investor.investmentSettings}
            onChange={this.handleChange}
            dealCategories={dealCategories}
            defaultCurrency={defaultCurrency}
          />
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.saving}
              loading={this.state.loading}
              content="Save"
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
  graphql(investorQuery, {
    props: ({ data: { investor } }) => ({ investor }),
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
          refetchQueries: [{ query: investorQuery }],
        }),
    }),
  }),
)(SettingsAccount);
