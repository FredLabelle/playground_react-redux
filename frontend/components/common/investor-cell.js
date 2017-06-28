import { Table, Header, Image } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';

const InvestorCell = ({ investor }) =>
  <Table.Cell>
    <Header as="h4" image>
      <Image src={investor.pictureUrl} shape="rounded" size="mini" />
      <Header.Content>
        {investor.fullName}
        <Header.Subheader>
          {investor.companyName}
        </Header.Subheader>
      </Header.Content>
    </Header>
  </Table.Cell>;
InvestorCell.propTypes = { investor: InvestorPropType.isRequired };

export default InvestorCell;
