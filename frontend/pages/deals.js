import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Deals from '../components/deals';

const DealsPage = () =>
  <Container>
    <NavBar />
    <Deals />
  </Container>;

export default withData(DealsPage);
