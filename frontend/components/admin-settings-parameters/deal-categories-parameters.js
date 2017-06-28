import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Header, Form, Message, Button } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { FormPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import { updateDealCategoriesMutation } from '../../lib/mutations';
import { setUnsavedChanges } from '../../actions/form';
import DealCategoryField from './deal-category-field';

class DealCategoriesParameters extends Component {
  static propTypes = {
    form: FormPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    updateDealCategories: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  state = {
    dealCategories: this.props.organization.dealCategories,
    saving: false,
    saved: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ saving: true });
    const { data: { updateDealCategories } } = await this.props.updateDealCategories(this.update());
    this.setState({ saving: false });
    if (updateDealCategories) {
      this.props.setUnsavedChanges(false);
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
    } else {
      console.error('UPDATE DEAL CATEGORIES ERROR');
    }
  };
  onNewDealCategoryClick = event => {
    event.preventDefault();
    const dealCategories = cloneDeep(this.state.dealCategories);
    dealCategories.push({
      id: Date.now(),
      name: '',
      investmentMethods: ['DealByDeal'],
    });
    this.setState({ dealCategories }, this.setUnsavedChanges);
  };
  setUnsavedChanges = () => {
    const { dealCategories } = this.props.organization;
    const dealCategoriesOmitted = omitDeep(dealCategories, '__typename');
    const unsavedChanges = !isEqual(this.update(), dealCategoriesOmitted);
    this.props.setUnsavedChanges(unsavedChanges);
  };
  handleChange = (event, { name, value }) => {
    if (!value) {
      const dealCategories = cloneDeep(this.state.dealCategories);
      const [, index] = name.split('.');
      dealCategories.splice(index, 1);
      this.setState({ dealCategories }, this.setUnsavedChanges);
      return;
    }
    const handler = handleChange(this.setUnsavedChanges).bind(this);
    handler(event, { name, value });
  };
  update = () => omitDeep(this.state.dealCategories, '__typename');
  render() {
    return (
      <Segment basic>
        <Header as="h3" dividing>
          Deal categories
        </Header>
        <Form onSubmit={this.onSubmit} success={this.state.success}>
          {this.state.dealCategories.map((dealCategory, index) =>
            <DealCategoryField
              key={dealCategory.id}
              name={`dealCategories.${index}`}
              value={dealCategory}
              onChange={this.handleChange}
            />,
          )}
          <Button type="button" primary icon="plus" onClick={this.onNewDealCategoryClick} />
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
  graphql(updateDealCategoriesMutation, {
    props: ({ mutate, ownProps: { organization } }) => ({
      updateDealCategories: input =>
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
)(DealCategoriesParameters);
