import { Container } from 'semantic-ui-react';

import withData from '../lib/withData';
import NavBar from '../components/navbar';
import Invoices from '../components/invoices';
import Payments from '../components/payments';

const InvoicesPage = () =>
  <Container>
    <NavBar />
    <Invoices />
    <Payments />
  </Container>;

export default withData(InvoicesPage);
