import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminDeals from '../../../components/admin-deals';

const AdminDealsPage = () =>
  <Container>
    <NavBar />
    <AdminDeals />
  </Container>;

export default withData(AdminDealsPage);
