import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Form, Header, Button, Segment, Message } from 'semantic-ui-react';

import { handleChange } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { invitationStatusMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';
import PasswordField from '../fields/password-field';
import InvestmentField from '../fields/investment-field';

class NewInvestorForm extends Component {
  static propTypes = {
    signup: PropTypes.bool,
    warning: PropTypes.bool.isRequired,
    router: RouterPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = { signup: false, success: false };
  state = {
    investor: {
      name: {
        firstName: this.props.router.query.firstName || '',
        lastName: this.props.router.query.lastName || '',
      },
      email: this.props.router.query.email || '',
      password: '',
      investmentSettings: {},
    },
    investmentSettingsError: false,
    info: false,
    warning: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    const { investmentSettings } = this.state.investor;
    const investmentSettingsError = Object.values(investmentSettings).length === 0;
    this.setState({ investmentSettingsError });
    if (investmentSettingsError) {
      return;
    }
    const { data: { invitationStatus } } = await this.props.invitationStatus({
      email: this.state.investor.email,
      organizationId: this.props.organization.id,
    });
    const info = !this.props.signup && invitationStatus === 'invited';
    const warning = invitationStatus === 'joined';
    this.setState({ info, warning });
    if (info || warning) {
      return;
    }
    this.props.onSubmit({
      ...this.state.investor,
      token: this.props.router.query.token,
    });
  };
  handleChange = handleChange().bind(this);
  render() {
    const { dealCategories, parametersSettings } = this.props.organization;
    const { defaultCurrency, optOutTime } = parametersSettings.investmentMechanisms;
    return (
      <Form
        onSubmit={this.onSubmit}
        warning={this.props.warning || this.state.warning}
        success={this.props.success}
        error={this.state.investmentSettingsError}
      >
        <Header as="h2" dividing>
          {this.props.signup ? 'Create your Investor account' : 'Create new investor'}
        </Header>
        <Header as="h3" dividing>
          Investor identity
        </Header>
        <Form.Input
          name="investor.email"
          value={this.state.investor.email}
          onChange={this.handleChange}
          label="Email"
          placeholder="Email"
          type="email"
          required
          disabled={this.props.signup}
        />
        <NameField
          name="investor.name"
          value={this.state.investor.name}
          onChange={this.handleChange}
        />
        {this.props.signup &&
          <PasswordField
            grouped
            name="investor.password"
            value={this.state.investor.password}
            onChange={this.handleChange}
          />}
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
        {this.state.info &&
          <Message
            info
            header="Information!"
            content="This user has already been invited."
          />}
        {this.state.warning &&
          <Message warning header="Warning!" content="This user has already joined!" />}
        <Message error header="Error!" content="You must chose at least one investment method." />
        <Message success header="Success!" content="New investor created." />
        <Segment basic textAlign="center">
          <Button
            type="submit"
            primary
            disabled={this.props.warning || this.props.loading}
            content={this.props.signup ? 'Create my account' : 'Create'}
            icon="add user"
            labelPosition="left"
          />
        </Segment>
      </Form>
    );
  }
}

const mapStateToProps = ({ router, form }) => ({ router, form });

export default compose(
  connect(mapStateToProps, null, ({ router, form }, dispatchProps, ownProps) => ({
    ...ownProps,
    router,
    warning: form.passwordsMismatch || form.passwordTooWeak,
  })),
  graphql(invitationStatusMutation, {
    props: ({ mutate }) => ({
      invitationStatus: input => mutate({ variables: { input } }),
    }),
  }),
)(NewInvestorForm);
