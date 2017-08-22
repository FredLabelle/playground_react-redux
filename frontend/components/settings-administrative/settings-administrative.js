import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Form, Segment, Button } from 'semantic-ui-react';
import Router from 'next/router';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { omitDeep, handleChange } from '../../lib/util';
import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType, InvestorPropType } from '../../lib/prop-types';
import { upsertInvestorMutation } from '../../lib/mutations';
import { investorUserQuery } from '../../lib/queries';
import { setUnsavedChanges } from '../../actions/form';
import AdministrativeFields from '../common/administrative-fields';

const administrativeFields = [
  'id',
  'type',
  'name',
  'individualSettings',
  'corporationSettings',
  'advisor',
];

class SettingsAdministrative extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    investor: InvestorPropType,
    upsertInvestor: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { investor: null };
  state = {
    investor: pick(this.props.investor, administrativeFields),
    loading: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { upsertInvestor } } = await this.props.upsertInvestor(this.update());
    this.setState({ loading: false });
    if (upsertInvestor) {
      this.props.setUnsavedChanges(false);
      toastr.success('Success!', 'Your changes have been saved.');
      if (this.props.router.query.invited === 'true') {
        const router = { ...this.props.router };
        delete router.query.invited;
        Router.push(linkHref('/', router), linkAs('/', router));
      }
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  handleChange = handleChange(() => {
    const investor = pick(this.props.investor, administrativeFields);
    const investorOmitted = omitDeep(investor, '__typename');
    const unsavedChanges = !isEqual(this.update(), investorOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  update = () => omitDeep(this.state.investor, '__typename');
  render() {
    return (
      this.props.investor &&
      <Segment attached="bottom" className="tab active">
        <Form onSubmit={this.onSubmit}>
          <AdministrativeFields investor={this.state.investor} handleChange={this.handleChange} />
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.loading}
              loading={this.state.loading}
              content="Save"
              icon="save"
              labelPosition="left"
            />
          </Segment>
        </Form>
      </Segment>
    );
  }
}

export default compose(
  connect(({ router, form }) => ({ router, form }), { setUnsavedChanges }),
  graphql(investorUserQuery, {
    props: ({ data: { investorUser } }) => ({ investor: investorUser }),
  }),
  graphql(upsertInvestorMutation, {
    props: ({ mutate }) => ({
      upsertInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: investorUserQuery }],
        }),
    }),
  }),
)(SettingsAdministrative);
