import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Segment, Form, Header, Button } from 'semantic-ui-react';
import omit from 'lodash/omit';
import set from 'lodash/set';

import { OrganizationPropType, MePropType } from '../../lib/prop-types';
import { meQuery } from '../../lib/queries';
import { updateInvestorMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';
import CheckboxesField from '../fields/checkboxes-field';
import TicketField from '../fields/ticket-field';

class AccountTab extends Component {
  static propTypes = {
    organization: OrganizationPropType.isRequired,
    me: MePropType.isRequired,
    active: PropTypes.bool.isRequired,
    updateInvestor: PropTypes.func.isRequired,
  };
  state = {
    name: this.props.me.name,
    investmentSettings: this.props.me.investmentSettings,
    saving: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor({
      ...omit(this.state, 'saving'),
      name: omit(this.state.name, '__typename'),
      investmentSettings: {
        ...omit(this.state.investmentSettings, '__typename'),
        averageTicket: omit(this.state.investmentSettings.averageTicket, '__typename'),
      },
    });
    this.setState({ saving: false });
    if (updateInvestor) {
      console.info('UPDATE INVESTOR SUCCESS');
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = (event, { name, value }) => {
    const [field, ...path] = name.split('.');
    if (path.length) {
      const newState = { ...this.state[field] };
      this.setState({ [field]: set(newState, path, value) });
    } else {
      this.setState({ [name]: value });
    }
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit}>
          <Header as="h3" dividing>Investor identity</Header>
          <NameField name="name" value={this.state.name} onChange={this.handleChange} />
          <Header as="h3" dividing>Investor profile</Header>
          <CheckboxesField
            name="investmentSettings.dealCategories"
            value={this.state.investmentSettings.dealCategories}
            onChange={this.handleChange}
            checkboxes={this.props.organization.investmentSettings.dealCategories}
            label="Deal categories interested in"
          />
          <TicketField
            name="investmentSettings.averageTicket"
            value={this.state.investmentSettings.averageTicket}
            onChange={this.handleChange}
            label="Average ticket"
            required
          />
          <Segment basic textAlign="center">
            <Button
              primary
              disabled={this.state.saving}
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

export default graphql(updateInvestorMutation, {
  props: ({ mutate }) => ({
    updateInvestor: input =>
      mutate({
        variables: { input },
        refetchQueries: [{ query: meQuery }],
      }),
  }),
})(AccountTab);
