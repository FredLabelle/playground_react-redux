import PropTypes from 'prop-types';
import { Component } from 'react';
import { Grid } from 'semantic-ui-react';

import { DealCategoryPropType } from '../../lib/prop-types';
import DealCategoryField from './deal-category-field';

export default class extends Component {
  static propTypes = {
    dealCategories: PropTypes.arrayOf(DealCategoryPropType).isRequired,
    defaultCurrency: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.shape().isRequired,
    onChange: PropTypes.func.isRequired,
  };
  handleChange = (event, { name, value }) => {
    const newValue = {
      ...this.props.value,
      [name]: value,
    };
    if (!value.interested) {
      delete newValue[name];
    }
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  render() {
    const defaultValue = name => {
      const dealCategory = this.props.dealCategories.find(category => category.name === name);
      return {
        interested: false,
        method: dealCategory.investmentMethods[0],
        averageTicket: { amount: '', currency: 'eur' },
      };
    };
    return (
      <Grid>
        {this.props.dealCategories.map(dealCategory =>
          <DealCategoryField
            key={dealCategory.id}
            dealCategory={dealCategory}
            defaultCurrency={this.props.defaultCurrency}
            name={dealCategory.id}
            value={this.props.value[dealCategory.id] || defaultValue(dealCategory.name)}
            onChange={this.handleChange}
          />,
        )}
      </Grid>
    );
  }
}
