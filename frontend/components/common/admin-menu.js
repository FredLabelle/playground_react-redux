import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';
import { linkHref, linkAs } from '../../lib/url';

const AdminMenu = ({ router }) =>
  <Menu attached="top" tabular widths={3}>
    <Link prefetch href={linkHref('/', router)} as={linkAs('/', router)}>
      <Menu.Item name="/" active={router.pathname === '/' || router.pathname.startsWith('/deals')}>
        Deals
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/investors', router)} as={linkAs('/investors', router)}>
      <Menu.Item name="/investors" active={router.pathname.startsWith('/investors')}>
        Investors
      </Menu.Item>
    </Link>
    <Link prefetch href={linkHref('/tickets', router)} as={linkAs('/tickets', router)}>
      <Menu.Item name="/tickets" active={router.pathname.startsWith('/tickets')}>
        Tickets
      </Menu.Item>
    </Link>
  </Menu>;
AdminMenu.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(AdminMenu);
