import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';

import { AmountPropType } from '../../lib/prop-types';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: AmountPropType.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    min: PropTypes.string,
    max: PropTypes.string,
    currencyDisabled: PropTypes.bool,
  };
  static defaultProps = {
    placeholder: '',
    required: false,
    min: '',
    max: '',
    currencyDisabled: false,
  };
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    this.props.onChange(null, { name: this.props.name, value: newValue });
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
      <Form.Group>
        <Form.Input
          name="amount"
          value={this.props.value.amount}
          onChange={this.handleChange}
          label={this.props.label}
          type="number"
          placeholder={this.props.placeholder}
          required={this.props.required}
          min={this.props.min}
          max={this.props.max}
          width={12}
        />
        <Form.Select
          name="currency"
          value={this.props.value.currency}
          onChange={this.handleChange}
          label="Currency"
          options={options}
          placeholder="Currency"
          disabled={this.props.currencyDisabled}
          width={4}
        />
      </Form.Group>
    );
  }
}
