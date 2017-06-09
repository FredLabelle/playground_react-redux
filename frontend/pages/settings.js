import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Settings from '../components/settings';

const SettingsPage = () =>
  <Container>
    <NavBar />
    <Settings />
  </Container>;

export default withData(SettingsPage);
