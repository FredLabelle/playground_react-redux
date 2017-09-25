import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Cookies, withCookies } from 'react-cookie';
import { Form, Header, Segment, Button } from 'semantic-ui-react';
import Router from 'next/router';

import { handleChange } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { signupMutation } from '../../lib/mutations';
import { userQuery } from '../../lib/queries';
import AccountFields from '../common/account-fields';

class SignupForm extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    warning: PropTypes.bool.isRequired,
    signup: PropTypes.func.isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
  };
  state = {
    user: {
      name: {
        firstName: this.props.router.query.firstName || '',
        lastName: this.props.router.query.lastName || '',
      },
      email: this.props.router.query.email || '',
      password: '',
    },
    loading: false,
  };
  componentDidMount() {
    Router.prefetch('/settings');
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { userSignup } } = await this.props.signup({
      ...this.state.user,
      token: this.props.router.query.token,
    });
    if (userSignup) {
      this.props.cookies.set('token', userSignup, { path: '/' });
      Router.push('/','/',);
    } else {
      console.error('SIGNUP ERROR');
      this.setState({ loading: false });
    }
  };
  handleChange = handleChange().bind(this);
  render() {
    return (
      <Form onSubmit={this.onSubmit} warning={this.props.warning} success={this.state.success}>
        <Header as="h2" dividing>
          Create your account
        </Header>
        <AccountFields
          user={this.state.user}
          handleChange={this.handleChange}
          signup
          organization={this.props.organization}
        />
        <Segment basic textAlign="center">
          <Button
            type="submit"
            primary
            disabled={this.props.warning || this.state.loading}
            content="Create my account"
            icon="add user"
            labelPosition="left"
          />
        </Segment>
      </Form>
    );
  }
}

const mapStateToProps = ({ router, form }) => ({ router, form });

export default compose(
  withCookies,
  connect(mapStateToProps, null, ({ router, form }, dispatchProps, ownProps) => ({
    ...ownProps,
    router,
    warning: form.passwordsMismatch || form.passwordTooWeak,
  })),
  graphql(signupMutation, {
    props: ({ mutate }) => ({
      signup: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            {
              query: userQuery,
              fetchPolicy: 'network-only',
            },
          ],
        }),
    }),
  }),
)(SignupForm);
