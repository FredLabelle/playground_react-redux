import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminUsers from '../../../components/admin-users';

const AdminTicketsPage = () =>
  <Container>
    <NavBar />
    <AdminUsers />
  </Container>;

export default withData(AdminTicketsPage);
