import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import Router from 'next/router';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { investorSignupMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import NewInvestorForm from '../common/new-investor-form';

class SignupForm extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
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
    const { data: { investorSignup } } = await this.props.signup(investor);
    if (investorSignup) {
      this.props.cookies.set('token', investorSignup, { path: '/' });
      Router.push(
        linkHref('/settings/administrative', this.props.router),
        linkAs('/settings/administrative', this.props.router),
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
  connect(({ router }) => ({ router })),
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
