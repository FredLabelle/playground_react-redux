import { Menu } from 'semantic-ui-react';
import Link from 'next/link';
import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';

const SignUpMenuItem = ({ router }) =>
  <Menu.Item>
    <Link prefetch  href={linkHref('/signup', router)} as={linkAs('/signup', router)}>
      <a>Sign Up</a>
    </Link>
  </Menu.Item>;
SignUpMenuItem.propTypes = { router: RouterPropType.isRequired };

export default SignUpMenuItem;
