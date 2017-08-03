import { PropTypes } from 'prop-types';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { TicketsSumPropType } from '../../lib/prop-types';
import FormatAmount from './format-amount';

const TicketsSumCell = ({ ticketsSum, createdAt }) =>
  ticketsSum.count || (ticketsSum.sum && ticketsSum.sum.amount !== '0')
    ? <Table.Cell>
        {ticketsSum.count &&
          <span>
            {ticketsSum.count} ticket{ticketsSum.count === 1 ? '' : 's'}
            <br />
          </span>}
        {ticketsSum.sum && <FormatAmount amount={ticketsSum.sum} />}
        {createdAt &&
          <span>
            <br />
            {moment(createdAt).format('DD/MM/YYYY')}
          </span>}
      </Table.Cell>
    : <Table.Cell>No tickets</Table.Cell>;
TicketsSumCell.propTypes = {
  ticketsSum: TicketsSumPropType.isRequired,
  createdAt: PropTypes.string,
};
TicketsSumCell.defaultProps = { createdAt: null };

export default TicketsSumCell;
