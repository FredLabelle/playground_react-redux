import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment } from 'semantic-ui-react';
import omit from 'lodash/omit';
import Router from 'next/router';

import { linkHref, linkAs } from '../../lib/url';
import { sleep } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery, investorsQuery } from '../../lib/queries';
import { createInvestorMutation } from '../../lib/mutations';
import NewInvestorForm from '../common/new-investor-form';

class CreateNewInvestor extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    // eslint-disable-next-line react/no-unused-prop-types
    createInvestor: PropTypes.func.isRequired,
  };
  static defaultProps = { organization: null };
  state = {
    loading: false,
    success: false,
  };
  onSubmit = async investor => {
    this.setState({ loading: true });
    const newInvestor = omit(investor, 'password');
    const { data: { createInvestor } } = await this.props.createInvestor(newInvestor);
    if (createInvestor) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
      Router.push(
        linkHref('/investors', this.props.router),
        linkAs('/investors', this.props.router),
      );
    } else {
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        <NewInvestorForm
          organization={this.props.organization}
          onSubmit={this.onSubmit}
          loading={this.state.loading}
          success={this.state.success}
        />
      </Segment>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(createInvestorMutation, {
    props: ({ mutate }) => ({
      createInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: investorsQuery }],
        }),
    }),
  }),
)(CreateNewInvestor);
