import { Table, Header, Image } from 'semantic-ui-react';

import { CompanyPropType } from '../../lib/prop-types';

const CompanyCell = ({ company }) =>
  <Table.Cell>
    <Header as="h4" image>
      <Image src={`//logo.clearbit.com/${company.domain}?size=192`} size="mini" />
      <Header.Content>
        {company.name}
      </Header.Content>
    </Header>
  </Table.Cell>;
CompanyCell.propTypes = { company: CompanyPropType.isRequired };

export default CompanyCell;
