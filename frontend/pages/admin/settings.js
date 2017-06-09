import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminSettings from '../../components/admin-settings';

const AdminSettingsPage = () =>
  <Container>
    <NavBar />
    <AdminSettings />
  </Container>;

export default withData(AdminSettingsPage);
