import PropTypes from 'prop-types';
import { Component } from 'react';
import { Select } from 'semantic-ui-react';
import omit from 'lodash/omit';
import NumberFormat from 'react-number-format';

import { prefix } from '../../common/format-amount';

export default class extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    currencyValue: PropTypes.string.isRequired,
    handleCurrencyChange: PropTypes.func.isRequired,
    currencyDisabled: PropTypes.bool.isRequired,
  };
  handleChange = (event, { value }) => {
    this.props.onChange(event, { name: 'amount', value });
  };
  render() {
    const currencyOptions = [
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
      <div className="ui action input">
        <NumberFormat
          {...omit(this.props, [
            'currencyValue',
            'handleCurrencyChange',
            'currencyOptions',
            'currencyDisabled',
          ])}
          onChange={this.handleChange}
          thousandSeparator
          prefix={prefix(this.props.currencyValue)}
        />
        <Select
          style={{ minWidth: 0 }}
          name="currency"
          value={this.props.currencyValue}
          onChange={this.props.handleCurrencyChange}
          label="Currency"
          options={currencyOptions}
          placeholder="Currency"
          disabled={this.props.currencyDisabled}
          tabIndex="-1"
        />
      </div>
    );
  }
}
