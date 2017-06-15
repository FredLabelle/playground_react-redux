import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminDealsNew from '../../../components/admin-deals-new';

const AdminDealsNewPage = () =>
  <Container>
    <NavBar />
    <AdminDealsNew />
  </Container>;

export default withData(AdminDealsNewPage);
