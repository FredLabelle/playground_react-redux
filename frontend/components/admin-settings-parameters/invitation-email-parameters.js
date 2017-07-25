import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Header, Form, Message, Button } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';

import { handleChange, omitDeep } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import organizationQuery from '../../graphql/queries/organization.gql';
import updateOrganizationMutation from '../../graphql/mutations/update-organization.gql';
import { setUnsavedChanges } from '../../actions/form';

class InvitationEmailParameters extends Component {
  static propTypes = {
    organization: OrganizationPropType.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  state = {
    organization: pick(this.props.organization, 'parametersSettings'),
    warning: false,
    loading: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    const { body } = this.state.organization.parametersSettings.invitationEmail;
    const warning = !body.includes('{{signup_link}}');
    this.setState({ warning });
    if (warning) {
      return;
    }
    this.setState({ loading: true });
    const { data: { updateOrganization } } = await this.props.updateOrganization(this.update());
    this.setState({ loading: false });
    if (updateOrganization) {
      this.props.setUnsavedChanges(false);
      toastr.success('Success!', 'Your changes have been saved.');
    } else {
      toastr.error('Error!', 'Something went wrong.');
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
        <Header as="h3" dividing>
          Invitation email
        </Header>
        <p>You can personalize the invitation email sent to investors.</p>
        <Form onSubmit={this.onSubmit} warning={this.state.warning}>
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
            You can use <strong>{'{{organization}}'}</strong>, <strong>{'{{firstname}}'}</strong>,{' '}
            <strong>{'{{lastname}}'}</strong> and <strong>{'{{signup_link}}'}</strong>.
          </p>
          <Message
            warning
            header="Warning!"
            content="You must include {{signup_link}} in the body!"
          />
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
)(InvitationEmailParameters);
