import { Table, Label } from 'semantic-ui-react';
import moment from 'moment';
import capitalize from 'lodash/capitalize';

import { InvoicePropType } from '../../lib/prop-types';

const colors = {
  pending: 'red',
  paid: 'green',
};

const InvoiceStatusCell = ({ invoice }) => (
  <Table.Cell>
    <Label color={colors[invoice.status]}>{capitalize(invoice.status)}</Label>
    <br />
    {invoice.dueDate &&
      moment(invoice.dueDate, 'DD-MM-YYYY').format('DD/MM/YYYY')}
  </Table.Cell>
);
InvoiceStatusCell.propTypes = { invoice: InvoicePropType.isRequired };

export default InvoiceStatusCell;
