import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminInvestor from '../../../components/admin-investor';

const AdminInvestorPage = () =>
  <Container>
    <NavBar />
    <AdminInvestor />
  </Container>;

export default withData(AdminInvestorPage);
