import { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import { Form, Header, Button, Segment, Message } from 'semantic-ui-react';
import Router from 'next/router';

import { handleChange } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import { investorSignupMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import NameField from '../fields/name-field';
import CheckboxesField from '../fields/checkboxes-field';
import TicketField from '../fields/ticket-field';
import MechanismField from '../fields/mechanism-field';

class SignupForm extends Component {
  static propTypes = {
    organization: OrganizationPropType.isRequired,
    signup: PropTypes.func.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = {
    investor: {
      name: {
        firstName: '',
        lastName: '',
      },
      email: '',
      password: '',
      investmentSettings: {
        type: 'individual',
        dealCategories: [],
        averageTicket: {
          amount: '',
          currency: this.props.organization.parametersSettings.investment.defaultCurrency,
        },
        mechanism: 'systematic',
      },
    },
    repeatPassword: '',
    passwordMismatch: false,
  };
  componentDidMount() {
    Router.prefetch('/account');
  }
  onSubmit = async event => {
    event.preventDefault();
    //
    const passwordMismatch = this.state.investor.password !== this.state.repeatPassword;
    this.setState({ passwordMismatch });
    if (passwordMismatch) {
      return;
    }
    this.setState({ loading: true });
    const { data: { investorSignup } } = await this.props.signup({
      ...this.state.investor,
      organizationId: this.props.organization.id,
    });
    if (investorSignup) {
      this.props.cookies.set('token', investorSignup, { path: '/' });
      const { shortId } = this.props.organization;
      Router.push(
        `/account?shortId=${shortId}&tab=administrative`,
        `/organization/${shortId}/account?tab=administrative`,
      );
    } else {
      console.error('SIGNUP ERROR');
      this.setState({ loading: false });
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={this.state.passwordMismatch}>
        <Header as="h2" dividing>Create your Investor account</Header>
        <Header as="h3" dividing>Investor identity</Header>
        <NameField
          name="investor.name"
          value={this.state.investor.name}
          onChange={this.handleChange}
          required
        />
        <Form.Input
          name="investor.email"
          value={this.state.investor.email}
          onChange={this.handleChange}
          label="Email"
          placeholder="Email"
          type="email"
          required
        />
        <Form.Group>
          <Form.Input
            name="investor.password"
            value={this.state.investor.password}
            onChange={this.handleChange}
            label="Password"
            placeholder="Password"
            type="password"
            required
            width={8}
          />
          <Form.Input
            name="repeatPassword"
            value={this.state.repeatPassword}
            onChange={this.handleChange}
            label="Repeat password"
            placeholder="Repeat Password"
            type="password"
            required
            width={8}
          />
        </Form.Group>
        <Message
          error
          header="Password mismatch"
          content="Please double-check the passwords are matching."
        />
        <Header as="h3" dividing>Investor profile</Header>
        <CheckboxesField
          name="investor.investmentSettings.dealCategories"
          value={this.state.investor.investmentSettings.dealCategories}
          onChange={this.handleChange}
          checkboxes={this.props.organization.parametersSettings.investment.dealCategories}
          label="Deal categories interested in"
        />
        <TicketField
          name="investor.investmentSettings.averageTicket"
          value={this.state.investor.investmentSettings.averageTicket}
          onChange={this.handleChange}
          label="Average ticket"
          required
        />
        <MechanismField
          name="investor.investmentSettings.mechanism"
          value={this.state.investor.investmentSettings.mechanism}
          onChange={this.handleChange}
          label="Investment mechanism interested in"
        />
        <Segment basic textAlign="center">
          <Button type="submit" primary disabled={this.state.loading} content="Create my account" />
        </Segment>
      </Form>
    );
  }
}

export default compose(
  withCookies,
  graphql(investorSignupMutation, {
    props: ({ mutate }) => ({
      signup: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(SignupForm);
