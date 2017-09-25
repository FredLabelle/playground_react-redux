import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';

const LoginMenuItem = ({ router }) =>
  <Menu.Item>
    <Link prefetch href={'/login'} as={'/login'}>
      <a>Login</a>
    </Link>
  </Menu.Item>;
LoginMenuItem.propTypes = { router: RouterPropType.isRequired };

export default LoginMenuItem;
