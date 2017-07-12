import { Table } from 'semantic-ui-react';

import { DealPropType } from '../../lib/prop-types';
import { numberFormatter } from '../../lib/util';

const DealCell = ({ deal }) =>
  <Table.Cell>
    {deal.name} - {deal.category.name}
    <br />
    {numberFormatter(deal.amountAllocatedToOrganization.currency).format(
      deal.amountAllocatedToOrganization.amount,
    )}
  </Table.Cell>;
DealCell.propTypes = { deal: DealPropType.isRequired };

export default DealCell;
