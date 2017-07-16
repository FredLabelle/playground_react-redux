import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Header, Form, Button, Grid } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';

import { handleChange, omitDeep } from '../../lib/util';
import { FormPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery } from '../../lib/queries';
import { updateDealCategoriesMutation } from '../../lib/mutations';
import { setUnsavedChanges } from '../../actions/form';
import DealCategoryField from './deal-category-field';

const DealCategoryFields = ({ dealCategories, onChange }) =>
  <div>
    {dealCategories.map((dealCategory, index) =>
      <DealCategoryField
        key={dealCategory.id}
        index={index}
        name={`dealCategories.${index}`}
        value={dealCategory}
        onChange={onChange}
      />,
    )}
  </div>;
DealCategoryFields.propTypes = {
  dealCategories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChange: PropTypes.func.isRequired,
};

const DealCategoryFieldsSortable = SortableContainer(DealCategoryFields);

const AddDealCategoryField = ({ onNewDealCategoryClick }) =>
  <Grid>
    <Grid.Column width={2} style={{ textAlign: 'center' }}>
      <Button type="button" primary icon="plus" onClick={onNewDealCategoryClick} />
    </Grid.Column>
  </Grid>;
AddDealCategoryField.propTypes = { onNewDealCategoryClick: PropTypes.func.isRequired };

class DealCategoriesParameters extends Component {
  static propTypes = {
    form: FormPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    updateDealCategories: PropTypes.func.isRequired,
    setUnsavedChanges: PropTypes.func.isRequired,
  };
  state = {
    dealCategories: this.props.organization.dealCategories,
    loading: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data: { updateDealCategories } } = await this.props.updateDealCategories(this.update());
    this.setState({ loading: false });
    if (updateDealCategories) {
      this.props.setUnsavedChanges(false);
      toastr.success('Success!', 'Your changes have been saved.');
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    const dealCategories = arrayMove(this.state.dealCategories, oldIndex, newIndex);
    this.setState({ dealCategories }, this.setUnsavedChanges);
  };
  onNewDealCategoryClick = event => {
    event.preventDefault();
    const dealCategories = cloneDeep(this.state.dealCategories);
    dealCategories.push({
      id: uniqueId(),
      name: '',
      investmentMechanisms: ['DealByDeal'],
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
          <DealCategoryFieldsSortable
            dealCategories={this.state.dealCategories}
            onChange={this.handleChange}
            onSortEnd={this.onSortEnd}
            useDragHandle
            lockToContainerEdges
            helperClass="sortable-helper"
          />
          <AddDealCategoryField onNewDealCategoryClick={this.onNewDealCategoryClick} />
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
