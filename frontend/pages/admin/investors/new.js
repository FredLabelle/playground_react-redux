import { Container } from 'semantic-ui-react';

import withData from '../../../lib/withData';
import NavBar from '../../../components/navbar';
import AdminInvestorsNew from '../../../components/admin-investors-new';

const AdminInvestorsNewPage = () =>
  <Container>
    <NavBar />
    <AdminInvestorsNew />
  </Container>;

export default withData(AdminInvestorsNewPage);
