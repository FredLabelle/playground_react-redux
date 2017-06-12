import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import SettingsParameters from '../../components/settings-parameters';

const SettingsParametersPage = () =>
  <Container>
    <NavBar />
    <SettingsParameters />
  </Container>;

export default withData(SettingsParametersPage);
