import { Table } from 'semantic-ui-react';

import { TicketsPropType } from '../../lib/prop-types';
import { numberFormatter } from '../../lib/util';

const TicketsCell = ({ tickets }) => (
  <Table.Cell>
    {tickets.count} ticket{tickets.count === 1 ? '' : 's'}<br />
    {tickets.sum && numberFormatter(tickets.sum.currency).format(tickets.sum.amount)}
  </Table.Cell>
);
TicketsCell.propTypes = { tickets: TicketsPropType.isRequired };

export default TicketsCell;
