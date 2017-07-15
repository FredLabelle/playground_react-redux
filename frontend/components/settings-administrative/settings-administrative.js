import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { sleep, omitDeep, handleChange } from '../../lib/util';
import { MePropType, FormPropType } from '../../lib/prop-types';
import { upsertInvestorMutation } from '../../lib/mutations';
import { meQuery } from '../../lib/queries';
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
    form: FormPropType.isRequired,
    me: MePropType,
    upsertInvestor: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { me: null };
  state = {
    investor: pick(this.props.me, administrativeFields),
    saving: false,
    success: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { upsertInvestor } } = await this.props.upsertInvestor(this.update());
    this.setState({ saving: false });
    if (upsertInvestor) {
      this.props.setUnsavedChanges(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE INVESTOR ERROR');
    }
  };
  handleChange = handleChange(() => {
    const me = pick(this.props.me, administrativeFields);
    const meOmitted = omitDeep(me, '__typename');
    const unsavedChanges = !isEqual(this.update(), meOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  }).bind(this);
  update = () => omitDeep(this.state.investor, '__typename');
  render() {
    return (
      this.props.me &&
      <Segment attached="bottom" className="tab active">
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <AdministrativeFields investor={this.state.investor} handleChange={this.handleChange} />
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
  graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),
  graphql(upsertInvestorMutation, {
    props: ({ mutate }) => ({
      upsertInvestor: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: meQuery }],
        }),
    }),
  }),
)(SettingsAdministrative);
