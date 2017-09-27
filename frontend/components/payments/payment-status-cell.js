import { Table, Label } from 'semantic-ui-react';
import moment from 'moment';
import capitalize from 'lodash/capitalize';

import { PaymentPropType } from '../../lib/prop-types';

const colors = {
  unmatched: 'red',
  matched: 'green',
};

const PaymentStatusCell = ({ payment }) => (
  <Table.Cell>
    <Label color={colors[payment.status]}>{capitalize(payment.status)}</Label>
  </Table.Cell>
);
PaymentStatusCell.propTypes = { payment: PaymentPropType.isRequired };

export default PaymentStatusCell;
