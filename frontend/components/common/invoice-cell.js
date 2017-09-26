import { Table } from 'semantic-ui-react';

import { InvoicePropType } from '../../lib/prop-types';
import FormatAmount from './format-amount';

const InvoiceCell = ({ invoice }) => (
  <Table.Cell>
    Invoice - {invoice.customId}
    <br />
    {invoice.name}
  </Table.Cell>
);
InvoiceCell.propTypes = { invoice: InvoicePropType.isRequired };

export default InvoiceCell;
