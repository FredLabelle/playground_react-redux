import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';
import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';

const UserMenu = ({ router }) =>
  <Menu attached="top" tabular widths={3}>
    <Link prefetch href={linkHref('/', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname.startsWith('')}>
        Dashboard
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/invoices', router)} as={linkAs('/invoices', router)}>
      <Menu.Item name="/invoices" active={router.pathname.startsWith('/invoices')}>
        Invoices
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/wallets', router)} as={linkAs('/wallets', router)}>
      <Menu.Item name="/wallets" active={router.pathname.startsWith('/wallets')}>
        Wallets
      </Menu.Item>
    </Link>
  </Menu>;
UserMenu.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(UserMenu);
