import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Menu, Image } from 'semantic-ui-react';
import Link from 'next/link';

import { linkHref, linkAs } from '../../lib/url';
import {
  RouterPropType,
  OrganizationPropType,
  InvestorPropType,
  AdminPropType,
} from '../../lib/prop-types';
import { organizationQuery, investorQuery, adminQuery } from '../../lib/queries';
import LoginMenuItem from './login-menu-item';
import UserDropdownMenu from './user-dropdown-menu';

const OrganizationNavBar = ({ router, organization, user }) =>
  organization &&
  <Menu secondary>
    <Menu.Item className="horizontally fitted">
      <Link prefetch href={linkHref('/', router, user)} as={linkAs('/', router, user)}>
        <a>
          <Image
            src={`//logo.clearbit.com/${organization.domain}?size=35`}
            alt={`${organization.generalSettings.name} logo`}
          />
        </a>
      </Link>
    </Menu.Item>
    <Menu.Item className="horizontally fitted">
      <Link prefetch href={linkHref('/', router, user)} as={linkAs('/', router, user)}>
        <a>Home</a>
      </Link>
    </Menu.Item>
    <Menu className="right" secondary>
      {user ? <UserDropdownMenu router={router} user={user} /> : <LoginMenuItem router={router} />}
    </Menu>
  </Menu>;
OrganizationNavBar.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
  user: PropTypes.oneOfType([InvestorPropType, AdminPropType]),
};
OrganizationNavBar.defaultProps = { organization: null, user: null };

export default compose(
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(investorQuery, {
    props: ({ data: { investor } }) => ({ user: investor }),
  }),
  graphql(adminQuery, {
    props: ({ data: { admin } }) => ({ user: admin }),
  }),
)(OrganizationNavBar);
