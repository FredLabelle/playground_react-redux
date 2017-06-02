import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Account from '../components/account';

const AccountPage = () => (
  <Container>
    <NavBar />
    <Account />
  </Container>
);

export default withData(AccountPage);
