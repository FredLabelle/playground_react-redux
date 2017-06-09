import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Header, Form, Message, Button } from 'semantic-ui-react';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import { updateOrganizationMutation } from '../../lib/mutations';
import { setUnsavedChanges } from '../../actions/form';

class InvitationEmailParameters extends Component {
  static propTypes = {
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
    return (
      <Segment basic>
        <Header as="h3" dividing>Invitation email</Header>
        <p>You can personalize the invitation email sent to investors.</p>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <Form.Input
            name="organization.parametersSettings.invitationEmail.subject"
            value={this.state.organization.parametersSettings.invitationEmail.subject}
            onChange={this.handleChange}
            label="Subject"
            placeholder="Subject"
          />
          <Form.TextArea
            name="organization.parametersSettings.invitationEmail.body"
            value={this.state.organization.parametersSettings.invitationEmail.body}
            onChange={this.handleChange}
            label="Description"
            placeholder="Description"
            autoHeight
          />
          <p>
            You can use <strong>{'{{organization}}'}</strong>,{' '}
            <strong>{'{{firstName}}'}</strong>, <strong>{'{{lastName}}'}</strong>{' '}
            and <strong>{'{{signupLink}}'}</strong>.
          </p>
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
)(InvitationEmailParameters);
