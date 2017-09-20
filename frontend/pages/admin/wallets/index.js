import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminWallets from '../../../components/admin-wallets'

const AdminTicketsPage = () =>
  <Container>
    <NavBar />
    <AdminWallets/>
  </Container>;

export default withData(AdminTicketsPage);
