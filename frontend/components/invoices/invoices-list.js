import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { InvoicePropType } from '../../lib/prop-types';
import InvoiceCell from '../common/invoice-cell';
import InvoiceDetailCell from '../common/invoice-detail-cell';
import ClientCell from '../common/client-cell';
import InvoiceStatusCell from '../common/invoice-status-cell';

const InvoicesListHeader = () => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Reference</Table.HeaderCell>
      <Table.HeaderCell>Details</Table.HeaderCell>
      <Table.HeaderCell>Client</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

const InvoicesListRow = ({ invoice }) => (
  <Table.Row>
    <InvoiceCell invoice={invoice} />
    <InvoiceDetailCell invoice={invoice} />
    <ClientCell client={invoice.debtor} />
    <InvoiceStatusCell invoice={invoice} />
  </Table.Row>
);
InvoicesListRow.propTypes = { invoice: InvoicePropType.isRequired };

const InvoicesList = ({ invoices }) =>
  invoices.length ? (
    <Table basic="very" celled>
      <InvoicesListHeader />
      <Table.Body>{invoices.map(invoice => <InvoicesListRow key={invoice.id} invoice={invoice} />)}</Table.Body>
    </Table>
  ) : null;
InvoicesList.propTypes = { invoices: PropTypes.arrayOf(InvoicePropType).isRequired };

export default InvoicesList;
