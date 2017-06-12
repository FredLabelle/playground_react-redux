import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminSettingsUsers from '../../../components/admin-settings-users';

const AdminSettingsUsersPage = () =>
  <Container>
    <NavBar />
    <AdminSettingsUsers />
  </Container>;

export default withData(AdminSettingsUsersPage);
