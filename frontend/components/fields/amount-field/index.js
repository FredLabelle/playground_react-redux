import PropTypes from 'prop-types';
import { Component } from 'react';
import { Form } from 'semantic-ui-react';

import { AmountPropType } from '../../../lib/prop-types';
import NumberFormatInput from './number-format-input';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: AmountPropType.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    min: PropTypes.string,
    max: PropTypes.string,
    currencyDisabled: PropTypes.bool,
    width: PropTypes.number,
  };
  static defaultProps = {
    label: '',
    placeholder: '',
    required: false,
    min: '0',
    max: '',
    currencyDisabled: false,
    width: 16,
  };
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  render() {
    return (
      <Form.Input
        name="amount"
        control={NumberFormatInput}
        value={this.props.value.amount}
        onChange={this.handleChange}
        label={this.props.label}
        placeholder={this.props.placeholder}
        required={this.props.required}
        min={this.props.min}
        max={this.props.max}
        width={this.props.width}
        // currency props
        currencyValue={this.props.value.currency}
        handleCurrencyChange={this.handleChange}
        currencyDisabled={this.props.currencyDisabled}
      />
    );
  }
}
