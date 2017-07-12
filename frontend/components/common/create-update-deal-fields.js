import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import get from 'lodash/get';

import { DealPropType } from '../../lib/prop-types';
import FilesField from '../fields/files-field';
import AmountField from '../fields/amount-field';
import DateField from '../fields/date-field';
import PercentField from '../fields/percent-field';

export function afterHandleChange(name) {
  if (
    ![
      'deal.roundSize',
      'deal.premoneyValuation',
      'deal.amountAllocatedToOrganization',
      'deal.minTicket',
      'deal.maxTicket',
    ].includes(name)
  ) {
    return;
  }
  const { currency } = get(this.state, name);
  this.setState({
    deal: {
      ...this.state.deal,
      roundSize: { ...this.state.deal.roundSize, currency },
      premoneyValuation: { ...this.state.deal.premoneyValuation, currency },
      amountAllocatedToOrganization: {
        ...this.state.deal.amountAllocatedToOrganization,
        currency,
      },
      minTicket: { ...this.state.deal.minTicket, currency },
      maxTicket: { ...this.state.deal.maxTicket, currency },
    },
  });
}

const CreateUpdateDealFields = ({ deal, handleChange, organizationName, dealCategoriesOptions }) =>
  <div>
    <Form.Group>
      <Form.Input
        name="deal.name"
        value={deal.name}
        onChange={handleChange}
        label="Name"
        placeholder="Name"
        required
        width={8}
      />
      <Form.Input
        name="deal.spvName"
        value={deal.spvName}
        onChange={handleChange}
        label="SPV Name"
        placeholder="SPV Name"
        width={8}
      />
    </Form.Group>
    <Form.TextArea
      name="deal.description"
      value={deal.description}
      onChange={handleChange}
      label="Description"
      placeholder="Description"
      autoHeight
    />
    <FilesField name="deal.deck" value={deal.deck} onChange={handleChange} label="Deck" multiple />
    {dealCategoriesOptions &&
      <Form.Select
        name="deal.categoryId"
        value={deal.categoryId}
        onChange={handleChange}
        options={dealCategoriesOptions}
        label="Category"
        placeholder="Category"
        required
      />}
    <AmountField
      name="deal.roundSize"
      value={deal.roundSize}
      onChange={handleChange}
      label="Size of the round"
      required
      width={8}
    />
    <AmountField
      name="deal.premoneyValuation"
      value={deal.premoneyValuation}
      onChange={handleChange}
      label="Premoney valuation"
      required
      width={8}
    />
    <AmountField
      name="deal.amountAllocatedToOrganization"
      value={deal.amountAllocatedToOrganization}
      onChange={handleChange}
      label={`Amount allocated to ${organizationName}`}
      required
      width={8}
    />
    <Form.Group>
      <AmountField
        name="deal.minTicket"
        value={deal.minTicket}
        onChange={handleChange}
        label="Min ticket"
        required
        width={8}
      />
      <AmountField
        name="deal.maxTicket"
        value={deal.maxTicket}
        onChange={handleChange}
        label="Max ticket"
        placeholder="No Limit"
        width={8}
      />
    </Form.Group>
    <DateField
      name="deal.referenceClosingDate"
      value={deal.referenceClosingDate}
      onChange={handleChange}
      label="Reference closing date"
      width={8}
    />
    <Form.Group>
      <PercentField
        name="deal.carried"
        value={deal.carried}
        onChange={handleChange}
        label="Carried"
        placeholder="Carried"
        required
        width={8}
      />
      <PercentField
        name="deal.hurdle"
        value={deal.hurdle}
        onChange={handleChange}
        label="Hurdle"
        placeholder="Hurdle"
        required
        width={8}
      />
    </Form.Group>
  </div>;
CreateUpdateDealFields.propTypes = {
  deal: DealPropType.isRequired,
  handleChange: PropTypes.func.isRequired,
  organizationName: PropTypes.string.isRequired,
  dealCategoriesOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
};
CreateUpdateDealFields.defaultProps = { dealCategoriesOptions: null };

export default CreateUpdateDealFields;
