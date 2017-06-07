import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Form, Header, Segment, Button, Message } from 'semantic-ui-react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import { omitDeep, handleChange } from '../../lib/util';
import { MePropType } from '../../lib/prop-types';
import { updateInvestorMutation, updateInvestorFileMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import RadioField from '../fields/radio-field';
import IndividualSettings from './individual-settings';
import CorporationSettings from './corporation-settings';
import NameField from '../fields/name-field';

class AdministrativeTab extends Component {
  static propTypes = {
    me: MePropType.isRequired,
    active: PropTypes.bool.isRequired,
    updateInvestor: PropTypes.func.isRequired,
    updateInvestorFile: PropTypes.func.isRequired,
    onUnsavedChangesChange: PropTypes.func.isRequired,
  };
  state = {
    name: this.props.me.name,
    type: this.props.me.type,
    individualSettings: {
      ...this.props.me.individualSettings,
      birthdate: moment(this.props.me.individualSettings.birthdate, 'DD-MM-YYYY'),
    },
    corporationSettings: this.props.me.corporationSettings,
    advisor: this.props.me.advisor,
    saving: false,
    success: false,
  };
  componentWillReceiveProps(props) {
    this.setState({
      individualSettings: {
        ...this.state.individualSettings,
        idDocument: props.me.individualSettings.idDocument,
      },
      corporationSettings: {
        ...this.state.corporationSettings,
        incProof: props.me.corporationSettings.incProof,
      },
    });
  }
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
    const me = pick(this.props.me, [
      'name',
      'type',
      'individualSettings',
      'corporationSettings',
      'advisor',
    ]);
    const meOmitted = omitDeep(me, 'idDocument', 'incProof', '__typename');
    const unsavedChanges = !isEqual(this.update(), meOmitted);
    this.props.onUnsavedChangesChange(unsavedChanges);
  }).bind(this);
  handleNationalityChange = nationality => {
    const newState = { ...this.state.individualSettings };
    newState.nationality = nationality;
    this.setState({ individualSettings: newState });
  };
  handleBirthdateChange = birthdate => {
    const newState = { ...this.state.individualSettings };
    newState.birthdate = birthdate;
    this.setState({ individualSettings: newState });
  };
  me = () => omit(this.state, 'saving', 'success');
  update = () => {
    const update = omitDeep(this.me(), 'idDocument', 'incProof', '__typename');
    const birthdate = this.state.individualSettings.birthdate.format('DD-MM-YYYY');
    update.individualSettings.birthdate = birthdate;
    return update;
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <RadioField
            name="type"
            value={this.state.type}
            onChange={this.handleChange}
            radio={[
              { value: 'individual', label: 'Individual' },
              { value: 'corporation', label: 'Corporation' },
            ]}
            label="Type of Investor"
          />
          {this.state.type === 'individual'
            ? <IndividualSettings
                me={this.me()}
                handleChange={this.handleChange}
                handleNationalityChange={this.handleNationalityChange}
                handleBirthdateChange={this.handleBirthdateChange}
                updateInvestorFile={this.props.updateInvestorFile}
              />
            : <CorporationSettings
                me={this.me()}
                handleChange={this.handleChange}
                updateInvestorFile={this.props.updateInvestorFile}
              />}
          <Header as="h3" dividing>Advisor</Header>
          <p>
            You can mention the information of an advisor
            that will be in copy of every correspondence.
          </p>
          <NameField
            name="advisor.name"
            value={this.state.advisor.name}
            onChange={this.handleChange}
          />
          <Form.Input
            name="advisor.email"
            value={this.state.advisor.email}
            onChange={this.handleChange}
            label="Email"
            placeholder="Email"
            type="email"
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

export default compose(
  graphql(updateInvestorMutation, {
    props: ({ mutate }) => ({
      updateInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
  graphql(updateInvestorFileMutation, {
    props: ({ mutate }) => ({
      updateInvestorFile: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(AdministrativeTab);
