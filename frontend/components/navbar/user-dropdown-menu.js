import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, withApollo, ApolloClient } from 'react-apollo';
import { withCookies, Cookies } from 'react-cookie';
import { Dropdown } from 'semantic-ui-react';
import Router from 'next/router';

import { logoutMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';

class UserDropdownMenu extends Component {
  static propTypes = {
    organizationShortId: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    logout: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies),
    // eslint-disable-next-line react/no-unused-prop-types
    client: PropTypes.instanceOf(ApolloClient).isRequired,
  };
  static defaultProps = { cookies: null };
  onClick = async () => {
    this.props.client.resetStore();
    const { data: { logout } } = await this.props.logout();
    if (logout) {
      this.props.cookies.remove('token', { path: '/' });
      Router.push(
        `/login?shortId=${this.props.organizationShortId}`,
        `/organization/${this.props.organizationShortId}/login`,
      );
    } else {
      console.error('LOGOUT ERROR');
    }
  };
  render() {
    return (
      <Dropdown item text={this.props.firstName}>
        <Dropdown.Menu>
          <Dropdown.Item>My Account</Dropdown.Item>
          <Dropdown.Item onClick={this.onClick}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const UserDropdownMenuWithApollo = withApollo(UserDropdownMenu);

const UserDropdownMenuWithCookies = withCookies(UserDropdownMenuWithApollo);

const UserDropdownMenuWithGraphQL = graphql(logoutMutation, {
  props: ({ mutate }) => ({
    logout: () =>
      mutate({
        refetchQueries: [{ query: meQuery }],
      }),
  }),
})(UserDropdownMenuWithCookies);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(UserDropdownMenuWithGraphQL);
