import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Button } from 'semantic-ui-react';

import { BACKEND_URL_BROWSER } from '../../lib/env';
import { OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import Login from '../common/login';

const AdminLogin = ({ organization }) =>
  <Login organization={organization}>
    <Segment basic textAlign="center">
      <a href={`${BACKEND_URL_BROWSER}/auth/google`}>
        <Button
          className="google plus"
          content="Login with Google"
          icon="google"
          labelPosition="left"
        />
      </a>
    </Segment>
  </Login>;
AdminLogin.propTypes = { organization: OrganizationPropType };
AdminLogin.defaultProps = { organization: null };

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
)(AdminLogin);
