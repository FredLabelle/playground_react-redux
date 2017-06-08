import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';
import { linkHref, linkAs } from '../../lib/url';

const LoginMenuItem = ({ router }) =>
  <Menu.Item>
    <Link prefetch href={linkHref('/login', router)} as={linkAs('/login', router)}>
      <a>Login</a>
    </Link>
  </Menu.Item>;
LoginMenuItem.propTypes = { router: RouterPropType.isRequired };

export default LoginMenuItem;
