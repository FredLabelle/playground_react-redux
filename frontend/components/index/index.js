import { connect } from 'react-redux';

import { RouterPropType } from '../../lib/prop-types';
import OrganizationIndex from './organization-index';
import Home from './home';

const Index = ({ router }) =>
  router.organizationShortId ? <OrganizationIndex router={router} /> : <Home />;
Index.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(Index);
