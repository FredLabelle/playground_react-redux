import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import { Segment, Form, Header, Image, Button } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';

import { handleChange, omitDeep } from '../../lib/util';
import { FormPropType, OrganizationPropType } from '../../lib/prop-types';
import updateOrganizationMutation from '../../graphql/mutations/update-organization.gql';
import organizationQuery from '../../graphql/queries/organization.gql';
import { setUnsavedChanges } from '../../actions/form';

class AdminSettingsGeneral extends Component {
  static propTypes = {
    form: FormPropType.isRequired,
    organization: OrganizationPropType,
    updateOrganization: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  static defaultProps = { organization: null };
  state = {
    organization: {
      ...pick(this.props.organization, 'generalSettings'),
      generalSettings: {
        ...this.props.organization.generalSettings,
        emailDomains: this.props.organization.generalSettings.emailDomains.join(', '),
      },
    },
    loading: false,
  };
  onSubmit = async event => {
    event.preventDefault();
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
    const organization = pick(this.props.organization, 'generalSettings');
    const organizationOmitted = omitDeep(organization, '__typename');
    const unsavedChanges = !isEqual(this.update(), organizationOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
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
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        <Form onSubmit={this.onSubmit}>
          <Header as="h3" dividing>
            Organization information
          </Header>
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
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.loading || !this.props.form.unsavedChanges}
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
  connect(({ router, form }) => ({ router, form }), { setUnsavedChanges }),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
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
)(AdminSettingsGeneral);
