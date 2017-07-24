import { Table } from 'semantic-ui-react';

import { DealPropType } from '../../lib/prop-types';
import { formatAmount } from '../../lib/util';

const DealCell = ({ deal }) =>
  <Table.Cell>
    {deal.name} - {deal.category.name}
    <br />
    {formatAmount(deal.amountAllocatedToOrganization)}
    {' - '}
    (size of the round: {formatAmount(deal.roundSize)})
  </Table.Cell>;
DealCell.propTypes = { deal: DealPropType.isRequired };

export default DealCell;
