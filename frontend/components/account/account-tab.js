import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Segment, Form, Header, Button, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { sleep, omitDeep, handleChange } from '../../lib/util';
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
    me: {
      ...pick(this.props.me, 'name', 'investmentSettings'),
    },
    saving: false,
    saved: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor(this.update());
    this.setState({ saving: false });
    if (updateInvestor) {
      this.props.onUnsavedChangesChange(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
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
  update = () => omitDeep(this.state.me, '__typename');
  render() {
    // console.log(this.state.me);
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <Header as="h3" dividing>Investor identity</Header>
          <NameField name="me.name" value={this.state.me.name} onChange={this.handleChange} />
          <Header as="h3" dividing>Investor profile</Header>
          <CheckboxesField
            name="me.investmentSettings.dealCategories"
            value={this.state.me.investmentSettings.dealCategories}
            onChange={this.handleChange}
            checkboxes={this.props.organization.parametersSettings.investment.dealCategories}
            label="Deal categories interested in"
          />
          <TicketField
            name="me.investmentSettings.averageTicket"
            value={this.state.me.investmentSettings.averageTicket}
            onChange={this.handleChange}
            label="Average ticket"
          />
          <MechanismField
            name="me.investmentSettings.mechanism"
            value={this.state.me.investmentSettings.mechanism}
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
