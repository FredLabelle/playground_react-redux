import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Header, Form, Message, Button } from 'semantic-ui-react';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { FormPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import { updateOrganizationMutation } from '../../lib/mutations';
import { setUnsavedChanges } from '../../actions/form';

class InvestmentMechanismsParameters extends Component {
  static propTypes = {
    form: FormPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  state = {
    organization: {
      ...pick(this.props.organization, 'parametersSettings'),
    },
    saving: false,
    saved: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateOrganization } } = await this.props.updateOrganization(this.update());
    this.setState({ saving: false });
    if (updateOrganization) {
      this.props.setUnsavedChanges(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE ORGANIZATION ERROR');
    }
  };
  handleChange = handleChange(() => {
    const organization = pick(this.props.organization, 'parametersSettings');
    const organizationOmitted = omitDeep(organization, '__typename');
    const unsavedChanges = !isEqual(this.update(), organizationOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  update = () => omitDeep(this.state.organization, '__typename');
  render() {
    const options = [
      {
        key: '$',
        text: 'USD',
        value: 'usd',
      },
      {
        key: '€',
        text: 'EUR',
        value: 'eur',
      },
    ];
    return (
      <Segment basic>
        <Header as="h3" dividing>
          Investment mechanisms
        </Header>
        <Header as="h2" dividing>
          Systematic investment with opt-out
        </Header>
        <p>
          The investor invests a systematic in every deal.<br />
          This guarantees the investor allocation in the deal.<br />
          The investor can opt-out if he feels not attracted by the deal.
        </p>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <Form.Input
            name="organization.parametersSettings.investmentMechanisms.optOutTime"
            value={this.state.organization.parametersSettings.investmentMechanisms.optOutTime}
            onChange={this.handleChange}
            label="Opt-out time"
            placeholder="Opt-out time"
            type="number"
            min="0"
            required
          />
          <Form.Select
            name="organization.parametersSettings.investmentMechanisms.defaultCurrency"
            value={this.state.organization.parametersSettings.investmentMechanisms.defaultCurrency}
            onChange={this.handleChange}
            label="Default currency"
            options={options}
            placeholder="Default currency"
          />
          <Message success header="Success!" content="Your changes have been saved." />
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.saving || !this.props.form.unsavedChanges}
              content={this.state.saving ? 'Saving…' : 'Save'}
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
  connect(({ form }) => ({ form }), { setUnsavedChanges }),
  graphql(updateOrganizationMutation, {
    props: ({ mutate, ownProps: { organization } }) => ({
      updateOrganization: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            {
              query: organizationQuery,
              variables: { shortId: organization.shortId },
            },
          ],
        }),
    }),
  }),
)(InvestmentMechanismsParameters);
