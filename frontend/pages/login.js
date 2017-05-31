import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Login from '../components/login';

const LoginPage = () => (
  <Container>
    <NavBar />
    <Login />
  </Container>
);

export default withData(LoginPage);
