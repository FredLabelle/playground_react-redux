import { Table } from 'semantic-ui-react';

import { InvoicePropType } from '../../lib/prop-types';
import FormatAmount from './format-amount';
import moment from 'moment';

const InvoiceDetailCell = ({ invoice }) => (
  <Table.Cell>
    <FormatAmount amount={invoice.netAmount} />
    <br />
    {invoice.creationDate &&
      moment(invoice.creationDate, 'DD-MM-YYYY').format('DD/MM/YYYY')}
  </Table.Cell>
);
InvoiceDetailCell.propTypes = { invoice: InvoicePropType.isRequired };

export default InvoiceDetailCell;
