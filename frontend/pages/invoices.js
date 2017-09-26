import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Invoices from '../components/invoices';

const InvoicesPage = () =>
  <Container>
    <NavBar />
    <Invoices />
  </Container>;

export default withData(InvoicesPage);
