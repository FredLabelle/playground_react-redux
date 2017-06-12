import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import SettingsIndex from '../../components/settings-index';

const SettingsIndexPage = () =>
  <Container>
    <NavBar />
    <SettingsIndex />
  </Container>;

export default withData(SettingsIndexPage);
