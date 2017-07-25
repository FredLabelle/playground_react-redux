import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment } from 'semantic-ui-react';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import organizationQuery from '../../graphql/queries/organization.gql';
import Form from './form';

const Signup = ({ organization }) =>
  organization &&
  <Segment>
    <Form organization={organization} />
  </Segment>;
Signup.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
};
Signup.defaultProps = { organization: null };

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
)(Signup);
