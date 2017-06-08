import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import { Segment, Form, Header, Image, Message, Button } from 'semantic-ui-react';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { OrganizationPropType } from '../../lib/prop-types';
import { updateOrganizationMutation } from '../../lib/mutations';
import { organizationQuery } from '../../lib/queries';

class GeneralTab extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    organization: OrganizationPropType.isRequired,
    updateOrganization: PropTypes.func.isRequired,
    onUnsavedChangesChange: PropTypes.func.isRequired,
  };
  state = {
    organization: {
      ...pick(this.props.organization, 'generalSettings'),
      generalSettings: {
        ...this.props.organization.generalSettings,
        emailDomains: this.props.organization.generalSettings.emailDomains.join(', '),
      },
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
      this.props.onUnsavedChangesChange(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE ORGANIZATION ERROR');
    }
  };
  handleChange = handleChange(() => {
    const organization = pick(this.props.organization, 'generalSettings');
    const organizationOmitted = omitDeep(organization, '__typename');
    const unsavedChanges = !isEqual(this.update(), organizationOmitted);
    this.props.onUnsavedChangesChange(unsavedChanges);
  }).bind(this);
  update = () => {
    const update = omitDeep(this.state.organization, '__typename');
    const { emailDomains } = this.state.organization.generalSettings;
    const emailDomainsArray = emailDomains.split(',').map(domain => domain.trim());
    update.generalSettings.emailDomains = emailDomainsArray;
    return update;
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          <Header as="h3" dividing>Organization information</Header>
          <Image
            src={`//logo.clearbit.com/${this.props.organization.domain}?size=192`}
            alt={`${this.props.organization.generalSettings.name} logo`}
            shape="circular"
            centered
          />
          <Form.Input
            name="organization.generalSettings.name"
            value={this.state.organization.generalSettings.name}
            onChange={this.handleChange}
            label="Name"
            placeholder="Name"
          />
          <Form.Input
            name="organization.generalSettings.website"
            value={this.state.organization.generalSettings.website}
            onChange={this.handleChange}
            label="Website"
            placeholder="Website"
            type="url"
          />
          <Form.TextArea
            name="organization.generalSettings.description"
            value={this.state.organization.generalSettings.description}
            onChange={this.handleChange}
            label="Description"
            placeholder="Description"
            autoHeight
          />
          <Form.Input
            name="organization.generalSettings.emailDomains"
            value={this.state.organization.generalSettings.emailDomains}
            onChange={this.handleChange}
            label="Email domains (comma separated list)"
            placeholder="Email domains"
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

export default graphql(updateOrganizationMutation, {
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
})(GeneralTab);
