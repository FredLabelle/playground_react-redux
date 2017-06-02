import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Form, Header, Segment, Button } from 'semantic-ui-react';
import omit from 'lodash/omit';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { MePropType } from '../../lib/prop-types';
import { updateInvestorMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';

class AdministrativeTab extends Component {
  static propTypes = {
    me: MePropType.isRequired,
    active: PropTypes.bool.isRequired,
    updateInvestor: PropTypes.func.isRequired,
  };
  state = {
    firstName: this.props.me.firstName,
    lastName: this.props.me.lastName,
    birthdate: moment(this.props.me.birthdate, 'DD-MM-YYYY'),
    nationality: this.props.me.nationality,
    address1: this.props.me.address1,
    address2: this.props.me.address2,
    city: this.props.me.city,
    zipCode: this.props.me.zipCode,
    country: this.props.me.country,
    state: this.props.me.state,
    advisorFullName: this.props.me.advisorFullName,
    advisorEmail: this.props.me.advisorEmail,
    loading: false,
  };
  componentDidMount() {
    const selects = [...document.getElementsByClassName('country-state-select')];
    selects.forEach(select => {
      const { style } = select;
      style.height = '37px';
    });
    const [inputContainer] = document.getElementsByClassName('react-datepicker__input-container');
    inputContainer.style.width = '100%';
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor({
      ...omit(this.state, 'loading'),
      birthdate: this.state.birthdate.format('DD-MM-YYYY'),
    });
    this.setState({ loading: false });
    if (updateInvestor) {
      //
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleBirthdateChange = birthdate => {
    this.setState({ birthdate });
  };
  handleNationalityChange = nationality => {
    this.setState({ nationality });
  };
  handleCountryChange = country => {
    this.setState({ country });
  };
  handleStateChange = state => {
    this.setState({ state });
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active && 'active'}`}>
        <Form onSubmit={this.onSubmit}>
          <Header as="h3" dividing>Individual information</Header>
          <Form.Group>
            <Form.Input
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              label="First name"
              placeholder="First Name"
              width={8}
            />
            <Form.Input
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              label="Last Name"
              placeholder="Last Name"
              width={8}
            />
          </Form.Group>
          <div className="fields">
            <div className="eight wide field">
              <label htmlFor="nationality">Nationality</label>
              <CountryDropdown
                value={this.state.nationality}
                onChange={this.handleNationalityChange}
                classes="country-state-select"
              />
            </div>
            <div className="eight wide field">
              <label htmlFor="birthdate">Birthdate</label>
              <DatePicker
                dateFormat="DD-MM-YYYY"
                showMonthDropdown
                showYearDropdown
                selected={this.state.birthdate}
                onChange={this.handleBirthdateChange}
              />
            </div>
          </div>
          <Header as="h3" dividing>Fiscal Address</Header>
          <Form.Input
            name="address1"
            value={this.state.address1}
            onChange={this.handleChange}
            label="Address 1"
            placeholder="9 rue Ambroise Thomas"
          />
          <Form.Input
            name="address2"
            value={this.state.address2}
            onChange={this.handleChange}
            label="Address 2"
          />
          <Form.Group>
            <Form.Input
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
              label="City"
              placeholder="Paris"
              width={8}
            />
            <Form.Input
              name="zipCode"
              value={this.state.zipCode}
              onChange={this.handleChange}
              label="Zip Code"
              placeholder="75009"
              width={8}
            />
          </Form.Group>
          <div className="fields">
            <div className="eight wide field">
              <label htmlFor="country">Country</label>
              <CountryDropdown
                value={this.state.country}
                onChange={this.handleCountryChange}
                classes="country-state-select"
              />
            </div>
            <div className="eight wide field">
              <label htmlFor="state">State</label>
              <RegionDropdown
                country={this.state.country}
                value={this.state.state}
                onChange={this.handleStateChange}
                classes="country-state-select"
              />
            </div>
          </div>
          <Header as="h3" dividing>Advisor</Header>
          <p>
            You can mention the information of an advisor
            that will be in copy of every correspondence.
          </p>
          <Form.Input
            name="advisorFullName"
            value={this.state.advisorFullName}
            onChange={this.handleChange}
            label="Advisor Full Name"
            placeholder="Advisor Full Name"
          />
          <Form.Input
            name="advisorEmail"
            value={this.state.advisorEmail}
            onChange={this.handleChange}
            label="Advisor Email"
            placeholder="Advisor Email"
          />
          <Segment basic textAlign="center">
            <Button primary disabled={this.state.loading}>Save administrative settings</Button>
          </Segment>
        </Form>
      </Segment>
    );
  }
}

export default graphql(updateInvestorMutation, {
  props: ({ mutate }) => ({
    updateInvestor: input =>
      mutate({
        variables: { input },
        refetchQueries: [{ query: meQuery }],
      }),
  }),
})(AdministrativeTab);
