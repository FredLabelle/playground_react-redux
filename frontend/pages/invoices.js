import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Menu from '../components/common/menu';
import Poc from '../components/poc_demo';

const InvoicesPage = () =>
  <Container>
    <NavBar />
    <Menu />
    <Poc />
  </Container>;

export default withData(InvoicesPage);
