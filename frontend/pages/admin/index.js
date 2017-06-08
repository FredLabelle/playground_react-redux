import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminIndex from '../../components/admin-index';

const AdminIndexPage = () =>
  <Container>
    <NavBar />
    <AdminIndex />
  </Container>;

export default withData(AdminIndexPage);
