import { Table, Header, Image } from 'semantic-ui-react';

//import { ClientPropType } from '../../lib/prop-types';

const ClientCell = ({ client }) => (
  <Table.Cell>
    <Header as="h4" image>
      <Image src={`//logo.clearbit.com/${client}?size=192`} size="mini" />
      <Header.Content>{client}</Header.Content>
    </Header>
  </Table.Cell>
);
//ClientCell.propTypes = { client: ClientPropType.isRequired };

export default ClientCell;
