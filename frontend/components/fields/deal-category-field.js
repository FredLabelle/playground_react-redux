import PropTypes from 'prop-types';
import { Component } from 'react';
import { Grid, Form, Checkbox } from 'semantic-ui-react';

import { AmountPropType, DealCategoryPropType } from '../../lib/prop-types';
import AmountField from './amount-field';

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({
      interested: PropTypes.bool.isRequired,
      mechanism: PropTypes.string,
      commitedTicket: AmountPropType,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    dealCategory: DealCategoryPropType.isRequired,
    defaultCurrency: PropTypes.string.isRequired,
  };
  handleCheckboxChange = event => {
    const newValue = {
      ...this.props.value,
      interested: !this.props.value.interested,
    };
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  handleRadioChange = (event, { value }) => {
    const newValue = {
      ...this.props.value,
      mechanism: value,
    };
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  handleAmountChange = (event, { value }) => {
    const newValue = {
      ...this.props.value,
      commitedTicket: value,
    };
    this.props.onChange(event, { name: this.props.name, value: newValue });
  };
  render() {
    const { dealCategory } = this.props;
    const dealByDeal =
      this.props.value.interested && dealCategory.investmentMechanisms.includes('DealByDeal');
    const systematicWithOptOut =
      this.props.value.interested &&
      dealCategory.investmentMechanisms.includes('SystematicWithOptOut');
    const commitedTicketDefaultValue = { amount: '', currency: this.props.defaultCurrency };
    return (
      <Grid.Row style={{ minHeight: 89 }}>
        <Grid.Column width={4}>
          <Form.Field
            checked={this.props.value.interested}
            onChange={this.handleCheckboxChange}
            label={dealCategory.name}
            control={Checkbox}
          />
        </Grid.Column>
        {dealByDeal &&
          <Grid.Column width={3}>
            <Form.Radio
              value="DealByDeal"
              checked={
                dealCategory.investmentMechanisms.length === 1
                  ? true
                  : this.props.value.mechanism === 'DealByDeal'
              }
              onChange={this.handleRadioChange}
              label="Deal by deal"
            />
          </Grid.Column>}
        {systematicWithOptOut &&
          <Grid.Column width={4}>
            <Form.Radio
              value="SystematicWithOptOut"
              checked={
                dealCategory.investmentMechanisms.length === 1
                  ? true
                  : this.props.value.mechanism === 'SystematicWithOptOut'
              }
              onChange={this.handleRadioChange}
              label="Systematic with opt-out"
            />
          </Grid.Column>}
        {this.props.value.mechanism === 'SystematicWithOptOut' &&
          systematicWithOptOut &&
          <Grid.Column width={5}>
            <AmountField
              name="commitedTicket"
              value={this.props.value.commitedTicket || commitedTicketDefaultValue}
              onChange={this.handleAmountChange}
              label="Commited ticket per deal"
              placeholder="Commited ticket"
              required
            />
          </Grid.Column>}
      </Grid.Row>
    );
  }
}
