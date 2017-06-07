import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Segment, Form, Header, Button, Message } from 'semantic-ui-react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { omitDeep, handleChange } from '../../lib/util';
import { OrganizationPropType, MePropType } from '../../lib/prop-types';
import { meQuery } from '../../lib/queries';
import { updateInvestorMutation } from '../../lib/mutations';
import NameField from '../fields/name-field';
import CheckboxesField from '../fields/checkboxes-field';
import TicketField from '../fields/ticket-field';
import MechanismField from '../fields/mechanism-field';

class AccountTab extends Component {
  static propTypes = {
    organization: OrganizationPropType.isRequired,
    me: MePropType.isRequired,
    active: PropTypes.bool.isRequired,
    updateInvestor: PropTypes.func.isRequired,
    onUnsavedChangesChange: PropTypes.func.isRequired,
  };
  state = {
    name: this.props.me.name,
    investmentSettings: this.props.me.investmentSettings,
    saving: false,
    saved: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor(this.update());
    this.setState({ saving: false });
    if (updateInvestor) {
      console.info('UPDATE INVESTOR SUCCESS');
      this.setState({ success: true });
      setTimeout(() => {
        this.setState({ success: false });
      }, 2000);
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = handleChange(() => {
    const me = pick(this.props.me, 'name', 'investmentSettings');
    const meOmitted = omitDeep(me, '__typename');
    const unsavedChanges = !isEqual(this.update(), meOmitted);
    this.props.onUnsavedChangesChange(unsavedChanges);
  }).bind(this);
  me = () => omit(this.state, 'saving', 'saved');
  update = () => omitDeep(this.me(), '__typename');
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
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
          />
          <MechanismField
            name="investmentSettings.mechanism"
            value={this.state.investmentSettings.mechanism}
            onChange={this.handleChange}
            label="Investment mechanism interested in"
          />
          <Message success header="Success!" content="Your changes have been saved." />
          <Segment basic textAlign="center">
            <Button
              type="submit"
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
