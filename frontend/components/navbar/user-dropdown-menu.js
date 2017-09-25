import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql, withApollo, ApolloClient } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Dropdown, Image } from 'semantic-ui-react';
import Link from 'next/link';
import Router from 'next/router';

import { RouterPropType, UserPropType } from '../../lib/prop-types';
import { logoutMutation } from '../../lib/mutations';
import { userQuery } from '../../lib/queries';

class UserDropdownMenu extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    user: PropTypes.oneOfType([UserPropType]).isRequired,
    logout: PropTypes.func.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    client: PropTypes.instanceOf(ApolloClient).isRequired,
  };
  componentDidMount() {
    Router.prefetch('/login');
  }
  onLogout = async () => {
    this.props.client.resetStore();
    const { data: { logout } } = await this.props.logout();
    if (logout) {
      this.props.cookies.remove('token', { path: '/' });
      const { router, user } = this.props;
      //TODO remove admin for now
      //const options = { ...router, admin: user ? user.role === 'admin' : router.admin };
      Router.push('/login', '/login');
    } else {
      console.error('LOGOUT ERROR');
    }
  };
  render() {
    const trigger = (
      <span>
        <Image avatar src={this.props.user.picture[0].url} /> {this.props.user.name.firstName}
      </span>
    );
    const { router, user } = this.props;
    //const options = { ...router, admin: user ? user.role === 'admin' : router.admin };
    return (
      <Dropdown item trigger={trigger}>
        <Dropdown.Menu>
          <Link prefetch href={'/settings'} as={'/settings'}>
            <Dropdown.Item>
              <a>Settings</a>
            </Dropdown.Item>
          </Link>
          <Dropdown.Item onClick={this.onLogout}>
            <a>Logout</a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default compose(
  withApollo,
  withCookies,
  graphql(logoutMutation, {
    props: ({ mutate }) => ({
      logout: () =>
        mutate({
          refetchQueries: [
            {
              query: userQuery,
              fetchPolicy: 'network-only',
            },
          ],
        }),
    }),
  }),
)(UserDropdownMenu);
