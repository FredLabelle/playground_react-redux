import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Header, Button, Segment, Message } from 'semantic-ui-react';

import { handleChange } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import NameField from '../fields/name-field';
import PasswordField from '../fields/password-field';
import InvestmentField from '../fields/investment-field';

class NewInvestorForm extends Component {
  static propTypes = {
    signup: PropTypes.bool,
    error: PropTypes.bool.isRequired,
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
  };
  onSubmit = event => {
    event.preventDefault();
    this.props.onSubmit({
      ...this.state.investor,
      token: this.props.router.query.token,
    });
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={this.props.error} success={this.props.success}>
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
          For <strong>Systematic with opt-out</strong>, the opt-out time is 5 days.
        </p>
        <InvestmentField
          name="investor.investmentSettings"
          value={this.state.investor.investmentSettings}
          onChange={this.handleChange}
          dealCategories={this.props.organization.dealCategories}
          defaultCurrency={this.props.organization.parametersSettings.investment.defaultCurrency}
        />
        <Message success header="Success!" content="New investor created." />
        <Segment basic textAlign="center">
          <Button
            type="submit"
            primary
            disabled={this.props.error || this.props.loading}
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

export default connect(mapStateToProps, null, ({ router, form }, dispatchProps, ownProps) => {
  const error = form.passwordsMismatch || form.passwordTooWeak;
  return Object.assign({ router, error }, ownProps);
})(NewInvestorForm);
