import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Grid, Image, Segment, Header } from 'semantic-ui-react';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import Form from './form';

const Login = ({ organization }) =>
  organization &&
  <Grid columns="equal">
    <Grid.Column />
    <Grid.Column width={8}>
      <Image
        src={`//logo.clearbit.com/${organization.domain}?size=192`}
        shape="circular"
        centered
      />
      <Segment>
        <Header as="h2" dividing>Welcome at {organization.name}</Header>
        <Form organization={organization} />
      </Segment>
    </Grid.Column>
    <Grid.Column />
  </Grid>;
Login.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
};
Login.defaultProps = { organization: null };

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
)(Login);
