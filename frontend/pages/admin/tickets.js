import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminTickets from '../../components/admin-tickets';

const AdminTicketsPage = () =>
  <Container>
    <NavBar />
    <AdminTickets />
  </Container>;

export default withData(AdminTicketsPage);
