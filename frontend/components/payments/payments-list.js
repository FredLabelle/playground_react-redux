import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { PaymentPropType } from '../../lib/prop-types';
import FormatAmount from '../common/format-amount';
import moment from 'moment';

const PaymentsListHeader = () => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>ID</Table.HeaderCell>
      <Table.HeaderCell>Date</Table.HeaderCell>
      <Table.HeaderCell>Description</Table.HeaderCell>
      <Table.HeaderCell>Payee</Table.HeaderCell>
      <Table.HeaderCell>Amount</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
);

const PaymentsListRow = ({ payment }) => (
  <Table.Row>
    <Table.Cell>{payment.id} </Table.Cell>
    <Table.Cell>{payment.creationDate && moment(payment.creationDate, 'DD-MM-YYYY').format('DD/MM/YYYY')}</Table.Cell>
    <Table.Cell>{payment.description} </Table.Cell>
    <Table.Cell>{payment.origin} </Table.Cell>
    <Table.Cell>
      <FormatAmount amount={payment.amount} />{payment.id}
    </Table.Cell>
  </Table.Row>
);
PaymentsListRow.propTypes = { payment: PaymentPropType.isRequired };

const PaymentsList = ({ payments }) =>
  payments.length ? (
    <Table basic="very" celled>
      <PaymentsListHeader />
      <Table.Body>{payments.map(payment => <PaymentsListRow key={payment.id} payment={payment} />)}</Table.Body>
    </Table>
  ) : null;
PaymentsList.propTypes = { payments: PropTypes.arrayOf(PaymentPropType).isRequired };

export default PaymentsList;
