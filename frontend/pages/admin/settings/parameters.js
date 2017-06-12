import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminSettingsParameters from '../../../components/admin-settings-parameters';

const AdminSettingsParametersPage = () =>
  <Container>
    <NavBar />
    <AdminSettingsParameters />
  </Container>;

export default withData(AdminSettingsParametersPage);
