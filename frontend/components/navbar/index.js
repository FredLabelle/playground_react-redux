import { connect } from 'react-redux';

import { RouterPropType } from '../../lib/prop-types';
import OrganizationNavBar from './organization-navbar';
// import organization from '../../queries/organization.gql';

const NavBar = ({ router }) =>
  router.organizationShortId ? <OrganizationNavBar router={router} /> : <div />;
NavBar.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(NavBar);
