import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import LoginMenuItem from './login-menu-item';
import UserDropdownMenu from './user-dropdown-menu';

import { organizationQuery, meQuery } from '../../lib/queries';
// import organization from '../../queries/organization.gql';

const NavBar = ({ organizationShortId, organization, me }) => organization && (
  <Menu secondary>
    <Menu.Item className="horizontally fitted">
      <Link href={`/?shortId=${organizationShortId}`} as={`/organization/${organizationShortId}`}>
        <a><img src={`//logo.clearbit.com/${organization.domain}?size=35`} alt="logo" /></a>
      </Link>
    </Menu.Item>
    <Menu.Item className="horizontally fitted">
      <Link href={`/?shortId=${organizationShortId}`} as={`/organization/${organizationShortId}`}>
        <a>{organization.name}</a>
      </Link>
    </Menu.Item>
    <Menu className="right" secondary>
      {me
        ? <UserDropdownMenu firstName={me.firstName} />
        : <LoginMenuItem organizationShortId={organizationShortId} />}
    </Menu>
  </Menu>
);

NavBar.propTypes = {
  organizationShortId: PropTypes.string.isRequired,
  organization: PropTypes.shape({
    name: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  }),
  me: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
  }),
};
NavBar.defaultProps = { organization: null, me: null };

const NavBarWithGraphQL = compose(
  graphql(organizationQuery, {
    options: ({ organizationShortId }) => ({
      variables: { shortId: organizationShortId },
    }),
    props: ({ data }) => ({ organization: data.organization }),
  }),
  graphql(meQuery, {
    props: ({ data }) => ({ me: data.me }),
  }),
)(NavBar);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(NavBarWithGraphQL);
