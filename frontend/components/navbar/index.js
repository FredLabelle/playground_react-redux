import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Menu, Image } from 'semantic-ui-react';
import Link from 'next/link';
import { connect } from 'react-redux';

import {
  RouterPropType,
  OrganizationPropType,
  UserPropType,
} from '../../lib/prop-types';
import { organizationQuery, userQuery } from '../../lib/queries';
import LoginMenuItem from './login-menu-item';
import SignUpMenuItem from './signup-menu-item';
import UserDropdownMenu from './user-dropdown-menu';

const NavBar = ({ router, organization, user }) =>
  <Menu secondary>
    <Menu.Item className="horizontally fitted">
      <Link
        prefetch
        href={'/'}
        as={'/'}
      >
        <a>
          <Image
            src="../../static/img/logo.png"
            alt="eFounders logo"
          />
        </a>
      </Link>
    </Menu.Item>
    <Menu.Item className="horizontally fitted">
      <Link
        prefetch
        href={'/'}
        as={'/'}
      >
        <a>Home</a>
      </Link>
    </Menu.Item>
    <Menu className="right" secondary>
      {user ? <UserDropdownMenu router={router} user={user} /> : <LoginMenuItem router={router} /> }
      {user ? <div /> : <SignUpMenuItem router={router} /> }
    </Menu>
  </Menu>;

NavBar.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
  user: PropTypes.oneOfType([UserPropType]),
};

NavBar.defaultProps = { organization: null, user: null };

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(userQuery, {
    props: ({ data: { user } }) => (user ? { user: user } : {}),
  }),
)(NavBar);
