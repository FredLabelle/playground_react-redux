import { Table } from 'semantic-ui-react';

import { TicketsSumPropType } from '../../lib/prop-types';
import { formatAmount } from '../../lib/util';

const TicketsSumCell = ({ ticketsSum }) =>
  ticketsSum.count || (ticketsSum.sum && ticketsSum.sum.amount !== '0')
    ? <Table.Cell>
        {ticketsSum.count &&
          <span>
            {ticketsSum.count} ticket{ticketsSum.count === 1 ? '' : 's'}
            <br />
          </span>}
        {ticketsSum.sum &&
          <span>{formatAmount(ticketsSum.sum)}</span>}
      </Table.Cell>
    : <Table.Cell>No tickets</Table.Cell>;
TicketsSumCell.propTypes = { ticketsSum: TicketsSumPropType.isRequired };

export default TicketsSumCell;
