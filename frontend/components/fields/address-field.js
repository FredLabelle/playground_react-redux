import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { AddressPropType } from '../../lib/prop-types';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: AddressPropType.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // TODO fix this with css
    const selects = [...document.getElementsByTagName('select')];
    selects.forEach(select => {
      const { style } = select;
      style.height = '37px';
    });
  }
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    this.props.onChange(null, { name: this.props.name, value: newValue });
  };
  handleCountryRegionChange = name => value => {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    this.props.onChange(null, { name: this.props.name, value: newValue });
  };
  render() {
    return (
      <div>
        <Form.Input
          name="address1"
          value={this.props.value.address1}
          onChange={this.handleChange}
          label="Address 1"
          placeholder="9 rue Ambroise Thomas"
        />
        <Form.Input
          name="address2"
          value={this.props.value.address2}
          onChange={this.handleChange}
          label="Address 2"
        />
        <Form.Group>
          <Form.Input
            name="city"
            value={this.props.value.city}
            onChange={this.handleChange}
            label="City"
            placeholder="Paris"
            width={8}
          />
          <Form.Input
            name="zipCode"
            value={this.props.value.zipCode}
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
              value={this.props.value.country}
              onChange={this.handleCountryRegionChange('country')}
            />
          </div>
          <div className="eight wide field">
            <label htmlFor="state">State</label>
            <RegionDropdown
              country={this.props.value.country}
              value={this.props.value.state}
              onChange={this.handleCountryRegionChange('state')}
            />
          </div>
        </div>
      </div>
    );
  }
}