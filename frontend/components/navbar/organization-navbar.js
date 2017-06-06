import { graphql, compose } from 'react-apollo';
import { Menu, Image } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType, OrganizationPropType, MePropType } from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import LoginMenuItem from './login-menu-item';
import UserDropdownMenu from './user-dropdown-menu';

const OrganizationNavBar = ({ organization, me }) =>
  organization &&
  <Menu secondary>
    <Menu.Item className="horizontally fitted">
      <Link
        prefetch
        href={`/?shortId=${organization.shortId}`}
        as={`/organization/${organization.shortId}`}
      >
        <a><Image src={`//logo.clearbit.com/${organization.domain}?size=35`} alt="logo" /></a>
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
        ? <UserDropdownMenu
            shortId={organization.shortId}
            firstName={me.name.firstName}
            pictureUrl={me.picture.url}
          />
        : <LoginMenuItem shortId={organization.shortId} />}
    </Menu>
  </Menu>;
OrganizationNavBar.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
  me: MePropType,
};
OrganizationNavBar.defaultProps = { organization: null, me: null };

export default compose(
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),
)(OrganizationNavBar);
