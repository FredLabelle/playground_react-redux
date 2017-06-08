import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminAccount from '../../components/admin-account';

const AdminAccountPage = () =>
  <Container>
    <NavBar />
    <AdminAccount />
  </Container>;

export default withData(AdminAccountPage);
