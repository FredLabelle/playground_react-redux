import PropTypes from 'prop-types';
import { Grid, Image, Segment, Header } from 'semantic-ui-react';

import { OrganizationPropType } from '../../lib/prop-types';

const Login = ({ organization, children }) =>
  <Grid columns="equal">
    <Grid.Column />
    <Grid.Column width={8}>
      <Image
        src={`//logo.clearbit.com/${organization.domain}?size=192`}
        alt={`${organization.generalSettings.name} logo`}
        shape="circular"
        centered
      />
      <Segment>
        <Header as="h2" dividing textAlign="center">
          Welcome at {organization.generalSettings.name}
        </Header>
        {children}
      </Segment>
    </Grid.Column>
    <Grid.Column />
  </Grid>;
Login.propTypes = {
  organization: OrganizationPropType.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
};

export default Login;
