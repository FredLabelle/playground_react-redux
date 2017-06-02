import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Segment } from 'semantic-ui-react';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
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

const SignupWithGraphGL = graphql(organizationQuery, {
  options: ({ router }) => ({
    variables: { shortId: router.organizationShortId },
  }),
  props: ({ data: { organization } }) => ({ organization }),
})(Signup);

const mapStateToProps = ({ router }) => ({ router });

export default connect(mapStateToProps)(SignupWithGraphGL);
