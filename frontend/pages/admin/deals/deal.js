import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminDeal from '../../../components/admin-deal';

const AdminDealPage = () =>
  <Container>
    <NavBar />
    <AdminDeal />
  </Container>;

export default withData(AdminDealPage);
