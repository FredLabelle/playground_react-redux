import { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import Router from 'next/router';

import { OrganizationPropType } from '../../lib/prop-types';
import { investorSignupMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import NewInvestorForm from '../common/new-investor-form';

class SignupForm extends Component {
  static propTypes = {
    organization: OrganizationPropType.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    signup: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = { loading: false };
  componentDidMount() {
    Router.prefetch('/settings');
  }
  onSubmit = async investor => {
    this.setState({ loading: true });
    const { data: { investorSignup } } = await this.props.signup({
      ...investor,
      organizationId: this.props.organization.id,
    });
    if (investorSignup) {
      this.props.cookies.set('token', investorSignup, { path: '/' });
      const { shortId } = this.props.organization;
      Router.push(
        `/settings?shortId=${shortId}&tab=administrative`,
        `/organization/${shortId}/settings?tab=administrative`,
      );
    } else {
      console.error('SIGNUP ERROR');
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <NewInvestorForm
        signup
        organization={this.props.organization}
        loading={this.state.loading}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default compose(
  withCookies,
  graphql(investorSignupMutation, {
    props: ({ mutate }) => ({
      signup: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(SignupForm);
