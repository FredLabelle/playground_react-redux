import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

const LoginMenuItem = ({ organizationShortId }) => (
  <Menu.Item>
    <Link
      href={`/login?shortId=${organizationShortId}`}
      as={`/organization/${organizationShortId}/login`}
    >
      <a>Login</a>
    </Link>
  </Menu.Item>
);
LoginMenuItem.propTypes = { organizationShortId: PropTypes.string.isRequired };

export default LoginMenuItem;
