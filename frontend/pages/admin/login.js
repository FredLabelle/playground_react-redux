import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminLogin from '../../components/admin-login';

const AdminLoginPage = () =>
  <Container>
    <NavBar />
    <AdminLogin />
  </Container>;

export default withData(AdminLoginPage);
