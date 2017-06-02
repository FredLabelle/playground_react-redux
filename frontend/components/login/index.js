import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Grid, Image, Segment, Header } from 'semantic-ui-react';

import { organizationQuery } from '../../lib/queries';
import Form from './form';

const Login = ({ organization }) => organization && (
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
        <Form />
      </Segment>
    </Grid.Column>
    <Grid.Column />
  </Grid>
);
Login.propTypes = {
  organization: PropTypes.shape({
    name: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  }),
};
Login.defaultProps = { organization: null };

const LoginWithGraphGL = graphql(organizationQuery, {
  options: ({ organizationShortId }) => ({
    variables: { shortId: organizationShortId },
  }),
  props: ({ data }) => ({ organization: data.organization }),
})(Login);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(LoginWithGraphGL);
