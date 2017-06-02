import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

const LoginMenuItem = ({ shortId }) =>
  <Menu.Item>
    <Link prefetch href={`/login?shortId=${shortId}`} as={`/organization/${shortId}/login`}>
      <a>Login</a>
    </Link>
  </Menu.Item>;
LoginMenuItem.propTypes = { shortId: PropTypes.string.isRequired };

export default LoginMenuItem;
