import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminTicketsNew from '../../../components/admin-tickets-new';

const AdminTicketsNewPage = () =>
  <Container>
    <NavBar />
    <AdminTicketsNew />
  </Container>;

export default withData(AdminTicketsNewPage);
