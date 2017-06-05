import { graphql } from 'react-apollo';

import { OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';

const OrganizationIndex = ({ organization }) =>
  organization &&
  <div>
    <h1>Welcome to {organization.name}</h1>
  </div>;
OrganizationIndex.propTypes = {
  organization: OrganizationPropType,
};
OrganizationIndex.defaultProps = { organization: null };

export default graphql(organizationQuery, {
  options: ({ router }) => ({
    variables: { shortId: router.organizationShortId },
  }),
  props: ({ data: { organization } }) => ({ organization }),
})(OrganizationIndex);
