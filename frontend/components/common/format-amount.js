import NumberFormat from 'react-number-format';

import { AmountPropType } from '../../lib/prop-types';

export const prefix = currency => {
  switch (currency) {
    case 'eur': {
      return '€';
    }
    case 'usd': {
      return '$';
    }
    default: {
      return '';
    }
  }
};

const FormatAmount = ({ amount }) => (
  <NumberFormat
    displayType="text"
    thousandSeparator
    prefix={prefix(amount.currency)}
    value={amount.amount}
  />
);
FormatAmount.propTypes = { amount: AmountPropType.isRequired };

export default FormatAmount;
