import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Form, Header, Segment, Button, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import { sleep, omitDeep, handleChange } from '../../lib/util';
import { MePropType } from '../../lib/prop-types';
import { updateInvestorMutation, updateInvestorFileMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
import { setUnsavedChanges } from '../../actions/form';
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
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  state = {
    me: {
      ...pick(this.props.me, [
        'name',
        'investmentSettings',
        'individualSettings',
        'corporationSettings',
        'advisor',
      ]),
      individualSettings: {
        ...this.props.me.individualSettings,
        birthdate: moment(this.props.me.individualSettings.birthdate, 'DD-MM-YYYY'),
      },
    },
    saving: false,
    success: false,
  };
  componentWillReceiveProps(props) {
    this.setState({
      me: {
        ...this.state.me,
        individualSettings: {
          ...this.state.me.individualSettings,
          idDocument: props.me.individualSettings.idDocument,
        },
        corporationSettings: {
          ...this.state.me.corporationSettings,
          incProof: props.me.corporationSettings.incProof,
        },
      },
    });
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateInvestor } } = await this.props.updateInvestor(this.update());
    this.setState({ saving: false });
    if (updateInvestor) {
      this.props.setUnsavedChanges(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = handleChange(() => {
    const me = pick(this.props.me, [
      'name',
      'investmentSettings',
      'individualSettings',
      'corporationSettings',
      'advisor',
    ]);
    const meOmitted = omitDeep(me, 'idDocument', 'incProof', '__typename');
    const unsavedChanges = !isEqual(this.update(), meOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  handleNationalityChange = nationality => {
    const newState = { ...this.state.me };
    newState.individualSettings.nationality = nationality;
    this.setState({ me: newState });
  };
  handleBirthdateChange = birthdate => {
    const newState = { ...this.state.me };
    newState.individualSettings.birthdate = birthdate;
    this.setState({ me: newState });
  };
  update = () => {
    const update = omitDeep(this.state.me, 'idDocument', 'incProof', '__typename');
    const birthdate = this.state.me.individualSettings.birthdate.format('DD-MM-YYYY');
    update.individualSettings.birthdate = birthdate;
    return update;
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <RadioField
            name="me.investmentSettings.type"
            value={this.state.me.investmentSettings.type}
            onChange={this.handleChange}
            radio={[
              { value: 'individual', label: 'Individual' },
              { value: 'corporation', label: 'Corporation' },
            ]}
            label="Type of Investor"
          />
          {this.state.me.investmentSettings.type === 'individual'
            ? <IndividualSettings
                me={this.state.me}
                handleChange={this.handleChange}
                handleNationalityChange={this.handleNationalityChange}
                handleBirthdateChange={this.handleBirthdateChange}
                updateInvestorFile={this.props.updateInvestorFile}
              />
            : <CorporationSettings
                me={this.state.me}
                handleChange={this.handleChange}
                updateInvestorFile={this.props.updateInvestorFile}
              />}
          <Header as="h3" dividing>Advisor</Header>
          <p>
            You can mention the information of an advisor
            that will be in copy of every correspondence.
          </p>
          <NameField
            name="me.advisor.name"
            value={this.state.me.advisor.name}
            onChange={this.handleChange}
          />
          <Form.Input
            name="me.advisor.email"
            value={this.state.me.advisor.email}
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
  connect(null, { setUnsavedChanges }),
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
