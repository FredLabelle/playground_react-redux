import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Index from '../components/index';

const IndexPage = () =>
  <Container>
    <NavBar />
    <Index />
  </Container>;

export default withData(IndexPage);
