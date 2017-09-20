import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';
import { linkHref, linkAs } from '../../lib/url';

const AdminMenu = ({ router }) =>
  <Menu attached="top" tabular widths={3}>
    <Link prefetch href={linkHref('/', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname === '/' || router.pathname.startsWith('/general')}>
        General
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/users', router)} as={linkAs('/users', router)}>
      <Menu.Item name="/users" active={router.pathname.startsWith('/users')}>
        Users
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/wallets', router)} as={linkAs('/wallets', router)}>
      <Menu.Item name="/wallets" active={router.pathname.startsWith('/wallets')}>
        Wallets
      </Menu.Item>
    </Link>
  </Menu>;
AdminMenu.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(AdminMenu);
