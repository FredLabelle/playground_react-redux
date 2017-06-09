import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql, withApollo, ApolloClient } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Dropdown, Image } from 'semantic-ui-react';
import Link from 'next/link';
import Router from 'next/router';

import { RouterPropType } from '../../lib/prop-types';
import { logoutMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import { linkHref, linkAs } from '../../lib/url';

class UserDropdownMenu extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    firstName: PropTypes.string.isRequired,
    pictureUrl: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    logout: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
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
      Router.push(linkHref('/login', this.props.router), linkAs('/login', this.props.router));
    } else {
      console.error('LOGOUT ERROR');
    }
  };
  render() {
    const trigger = (
      <span>
        <Image avatar src={this.props.pictureUrl} /> {this.props.firstName}
      </span>
    );
    return (
      <Dropdown item trigger={trigger}>
        <Dropdown.Menu>
          <Link
            prefetch
            href={linkHref('/settings', this.props.router)}
            as={linkAs('/settings', this.props.router)}
          >
            <Dropdown.Item>
              <a>Settings</a>
            </Dropdown.Item>
          </Link>
          <Dropdown.Item onClick={this.onLogout}><a>Logout</a></Dropdown.Item>
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
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(UserDropdownMenu);
