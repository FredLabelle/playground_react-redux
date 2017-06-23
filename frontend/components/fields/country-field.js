import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { CountryDropdown } from 'react-country-region-selector';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    width: PropTypes.number,
  };
  static defaultProps = { label: 'Country', width: 16 };
  handleChange = value => {
    this.props.onChange(null, { name: this.props.name, value });
  };
  render() {
    return (
      <Form.Field
        label={this.props.label}
        width={this.props.width}
        control={CountryDropdown}
        value={this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}
