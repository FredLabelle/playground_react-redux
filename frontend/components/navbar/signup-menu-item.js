import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType } from '../../lib/prop-types';

const SignUpMenuItem = ({ router }) =>
  <Menu.Item>
    <Link prefetch href={'/signup'} as={'/signup'}>
      <a>Sign Up</a>
    </Link>
  </Menu.Item>;
SignUpMenuItem.propTypes = { router: RouterPropType.isRequired };

export default SignUpMenuItem;
