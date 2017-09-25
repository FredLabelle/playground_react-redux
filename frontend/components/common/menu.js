import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';

const UserMenu = ({ router }) =>
  <Menu attached="top" tabular widths={2}>
    <Link prefetch href={'/'} as={'/'}>
      <Menu.Item name="/" active={router.pathname === '/'}>
        Dashboard
      </Menu.Item>
    </Link>
    <Link prefetch href={'/'} as={'/'}>
      <Menu.Item name="/" active={router.pathname.startsWith('')}>
        Invoices
      </Menu.Item>
    </Link>
    <Link prefetch href={'/'} as={'/'}>
      <Menu.Item name="/" active={router.pathname.startsWith('')}>
        Wallets
      </Menu.Item>
    </Link>
  </Menu>;
UserMenu.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(UserMenu);
