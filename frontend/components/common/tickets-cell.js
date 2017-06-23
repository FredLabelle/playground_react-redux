import { Table } from 'semantic-ui-react';

import { TicketsPropType } from '../../lib/prop-types';
import { numberFormatter } from '../../lib/util';

const TicketsCell = ({ tickets }) =>
  tickets.count || (tickets.sum && tickets.sum.amount !== '0')
    ? <Table.Cell>
        {tickets.count && <span>{tickets.count} ticket{tickets.count === 1 ? '' : 's'}<br /></span>}
        {tickets.sum &&
          <span>{numberFormatter(tickets.sum.currency).format(tickets.sum.amount)}</span>}
      </Table.Cell>
    : <Table.Cell>No tickets</Table.Cell>;
TicketsCell.propTypes = { tickets: TicketsPropType.isRequired };

export default TicketsCell;
