import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';
import { linkHref, linkAs } from '../../lib/url';

const InvestorMenu = ({ router }) =>
  <Menu attached="top" tabular widths={2}>
    <Link prefetch href={linkHref('/', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname === '/'}>
        Dashboard
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname.startsWith('/')}>
        Invoices
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/deals', router)} as={linkAs('/deals', router)}>
      <Menu.Item name="/" active={router.pathname.startsWith('/deals')}>
        Customers
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/deals', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname.startsWith('/')}>
        Templates
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/deals', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname.startsWith('/')}>
        Wallets
      </Menu.Item>
    </Link>
  </Menu>;
InvestorMenu.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(InvestorMenu);
