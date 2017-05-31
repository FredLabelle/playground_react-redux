import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Signup from '../components/signup';

const SignupPage = () => (
  <Container>
    <NavBar />
    <Signup />
  </Container>
);

export default withData(SignupPage);
