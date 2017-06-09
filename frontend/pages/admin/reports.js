import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminReports from '../../components/admin-reports';

const AdminReportsPage = () =>
  <Container>
    <NavBar />
    <AdminReports />
  </Container>;

export default withData(AdminReportsPage);
