import { Table } from 'semantic-ui-react';

import { DealPropType } from '../../lib/prop-types';
import FormatAmount from './format-amount';

const DealCell = ({ deal }) =>
  <Table.Cell>
    {deal.name} - {deal.category.name}
    <br />
    <FormatAmount amount={deal.amountAllocatedToOrganization} /> (size of the round:{' '}
    <FormatAmount amount={deal.roundSize} />)
  </Table.Cell>;
DealCell.propTypes = { deal: DealPropType.isRequired };

export default DealCell;
