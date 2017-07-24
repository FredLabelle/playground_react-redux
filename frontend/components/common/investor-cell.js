import { Table, Header, Image } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';

const InvestorCell = ({ investor }) =>
  <Table.Cell>
    <Header as="h4" image>
      <Image src={investor.picture[0].url} shape="rounded" size="mini" />
      <Header.Content>
        {investor.fullName === ' ' ? investor.email : investor.fullName}
        {/* <Header.Subheader>
          {investor.company.name}
        </Header.Subheader> */}
      </Header.Content>
    </Header>
  </Table.Cell>;
InvestorCell.propTypes = { investor: InvestorPropType.isRequired };

export default InvestorCell;
