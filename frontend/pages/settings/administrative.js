import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import SettingsAdministrative from '../../components/settings-administrative';

const SettingsAdministrativePage = () =>
  <Container>
    <NavBar />
    <SettingsAdministrative />
  </Container>;

export default withData(SettingsAdministrativePage);
