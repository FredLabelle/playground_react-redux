import { Container } from 'semantic-ui-react';

import withData from '../../lib/withData';
import NavBar from '../../components/navbar';
import AdminInvestors from '../../components/admin-investors';

const AdminInvestorsPage = () =>
  <Container>
    <NavBar />
    <AdminInvestors />
  </Container>;

export default withData(AdminInvestorsPage);
