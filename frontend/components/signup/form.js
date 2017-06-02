import { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import omit from 'lodash/omit';
import without from 'lodash/without';
import { Form, Header, Button, Segment, Checkbox, Message } from 'semantic-ui-react';
import Router from 'next/router';

import { OrganizationPropType } from '../../lib/prop-types';
import { investorSignupMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';

class SignupForm extends Component {
  static propTypes = {
    organization: OrganizationPropType.isRequired,
    signup: PropTypes.func.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    dealCategories: [],
    averageTicket: '',
    averageTicketCurrency: this.props.organization.defaultCurrency,
    investmentMechanism: 'systematic',
    passwordMismatch: false,
  };
  componentDidMount() {
    Router.prefetch('/account');
  }
  onSubmit = async event => {
    event.preventDefault();
    const passwordMismatch = this.state.password !== this.state.repeatPassword;
    this.setState({ passwordMismatch });
    if (passwordMismatch) {
      return;
    }
    this.setState({ loading: true });
    const { data: { investorSignup } } = await this.props.signup({
      ...omit(this.state, 'repeatPassword', 'passwordMismatch'),
      averageTicket: parseInt(this.state.averageTicket, 10),
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
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleDealCategoriesChange = (event, { name }) => {
    const checked = this.state.dealCategories.includes(name);
    if (checked) {
      this.setState({ dealCategories: without(this.state.dealCategories, name) });
    } else {
      this.setState({ dealCategories: [...this.state.dealCategories, name] });
    }
  };
  handleInvestmentMechanismChange = (event, { name }) => {
    this.setState({ investmentMechanism: name });
  };
  render() {
    const options = [
      {
        key: '$',
        text: 'USD',
        value: 'usd',
      },
      {
        key: '€',
        text: 'EUR',
        value: 'eur',
      },
    ];
    return (
      <Form onSubmit={this.onSubmit} error={this.state.passwordMismatch}>
        <Header as="h2" dividing>Create your Investor account</Header>
        <Header as="h3" dividing>Investor identity</Header>
        <Form.Group>
          <Form.Input
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleChange}
            label="First name"
            placeholder="First Name"
            required
            width={8}
          />
          <Form.Input
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleChange}
            label="Last Name"
            placeholder="Last Name"
            required
            width={8}
          />
        </Form.Group>
        <Form.Input
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          label="Email"
          placeholder="Email"
          type="email"
          required
        />
        <Form.Group>
          <Form.Input
            name="password"
            value={this.state.password}
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
        <Form.Group grouped id="dealCategories">
          <label htmlFor="dealCategories">Deal categories interested in</label>
          {this.props.organization.dealCategories.map(category =>
            <Form.Field
              name={category}
              checked={this.state.dealCategories.includes(category)}
              onChange={this.handleDealCategoriesChange}
              key={category}
              label={category}
              control={Checkbox}
            />,
          )}
        </Form.Group>
        <Form.Group>
          <Form.Input
            name="averageTicket"
            value={this.state.averageTicket}
            onChange={this.handleChange}
            label="Average ticket"
            type="number"
            required
            width={12}
          />
          <Form.Select
            name="averageTicketCurrency"
            value={this.state.averageTicketCurrency}
            onChange={this.handleChange}
            label="Currency"
            options={options}
            placeholder="Currency"
            width={4}
          />
        </Form.Group>
        <Form.Group grouped id="investmentMechanism">
          <label htmlFor="investmentMechanism">Investment mechanism interested in</label>
          <Form.Radio
            name="systematic"
            value="systematic"
            checked={this.state.investmentMechanism === 'systematic'}
            onChange={this.handleInvestmentMechanismChange}
            label={{
              children: (
                <div>
                  <p>Systematic with opt-out</p>
                  <em>
                    You invest a systematic amount in every deal.
                    This guarantees your allocation in the deal.
                    You can opt-out if you feel not attracted by the deal.
                  </em>
                </div>
              ),
            }}
          />
          <Form.Radio
            name="dealByDeal"
            value="dealByDeal"
            checked={this.state.investmentMechanism === 'dealByDeal'}
            onChange={this.handleInvestmentMechanismChange}
            label={{
              children: (
                <div>
                  <p>Deal-by-Deal</p>
                  <em>
                    You will be presented the deal, and decide to invest on a case-by-case basis.
                    Your allocation in the deal cannot be guaranteed
                    but is based on first come first serve.
                  </em>
                </div>
              ),
            }}
          />
        </Form.Group>
        <Segment basic textAlign="center">
          <Button primary disabled={this.state.loading}>Create my account</Button>
        </Segment>
      </Form>
    );
  }
}

const SignupFormWithCookies = withCookies(SignupForm);

export default graphql(investorSignupMutation, {
  props: ({ mutate }) => ({
    signup: input =>
      mutate({
        variables: { input },
        refetchQueries: [{ query: meQuery }],
      }),
  }),
})(SignupFormWithCookies);
