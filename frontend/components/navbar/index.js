import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType, OrganizationPropType, MePropType } from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import LoginMenuItem from './login-menu-item';
import UserDropdownMenu from './user-dropdown-menu';
// import organization from '../../queries/organization.gql';

const NavBar = ({ organization, me }) =>
  organization &&
  <Menu secondary>
    <Menu.Item className="horizontally fitted">
      <Link
        prefetch
        href={`/?shortId=${organization.shortId}`}
        as={`/organization/${organization.shortId}`}
      >
        <a><img src={`//logo.clearbit.com/${organization.domain}?size=35`} alt="logo" /></a>
      </Link>
    </Menu.Item>
    <Menu.Item className="horizontally fitted">
      <Link
        prefetch
        href={`/?shortId=${organization.shortId}`}
        as={`/organization/${organization.shortId}`}
      >
        <a>{organization.name}</a>
      </Link>
    </Menu.Item>
    <Menu className="right" secondary>
      {me
        ? <UserDropdownMenu shortId={organization.shortId} firstName={me.firstName} />
        : <LoginMenuItem shortId={organization.shortId} />}
    </Menu>
  </Menu>;

NavBar.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
  me: MePropType,
};
NavBar.defaultProps = { organization: null, me: null };

const NavBarWithGraphQL = compose(
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),
)(NavBar);

const mapStateToProps = ({ router }) => ({ router });

export default connect(mapStateToProps)(NavBarWithGraphQL);
