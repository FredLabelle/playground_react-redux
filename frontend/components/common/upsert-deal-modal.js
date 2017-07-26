import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import get from 'lodash/get';
import pick from 'lodash/pick';

import { handleChange, omitDeep } from '../../lib/util';
import { DealPropType, OrganizationPropType } from '../../lib/prop-types';
import { upsertDealMutation } from '../../lib/mutations';
import { dealQuery, dealsQuery } from '../../lib/queries';
import CompanyForm from './company-form';
import FilesField from '../fields/files-field';
import AmountField from '../fields/amount-field';
import DateField from '../fields/date-field';
import PercentField from '../fields/percent-field';

const initialState = ({ deal }) => ({
  deal: {
    ...pick(deal, [
      'id',
      'name',
      'spvName',
      'description',
      'deck',
      'roundSize',
      'premoneyValuation',
      'amountAllocatedToOrganization',
      'minTicket',
      'maxTicket',
      'referenceClosingDate',
      'carried',
      'hurdle',
    ]),
    companyId: deal.company && deal.company.id,
    categoryId: deal.category && deal.category.id,
  },
  companyIdError: false,
  categoryIdError: false,
  loading: false,
});

class UpsertDealModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deal: DealPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    upsertDeal: PropTypes.func.isRequired,
  };
  state = initialState(this.props);
  onSubmit = async event => {
    event.preventDefault();
    if (!this.props.deal.id) {
      const companyIdError = !this.state.deal.companyId;
      const categoryIdError = !this.state.deal.categoryId;
      this.setState({ companyIdError, categoryIdError });
      if (companyIdError || categoryIdError) {
        return;
      }
    }
    const deal = omitDeep(this.state.deal, '__typename');
    this.setState({ loading: true });
    const { data: { upsertDeal } } = await this.props.upsertDeal(deal);
    this.setState({ loading: false });
    if (upsertDeal) {
      toastr.success('Success!', this.props.deal.id ? 'Deal updated.' : 'Deal created.');
      this.onCancel();
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  onCancel = () => {
    this.setState(initialState(this.props));
    this.props.onClose();
  };
  handleCompanyChange = ({ id: companyId }) => {
    this.setState({
      deal: {
        ...this.state.deal,
        companyId,
      },
    });
  };
  handleChange = handleChange(name => {
    if (
      ![
        'deal.roundSize',
        'deal.premoneyValuation',
        'deal.amountAllocatedToOrganization',
        'deal.minTicket',
        'deal.maxTicket',
      ].includes(name)
    ) {
      return;
    }
    const { currency } = get(this.state, name);
    this.setState({
      deal: {
        ...this.state.deal,
        roundSize: { ...this.state.deal.roundSize, currency },
        premoneyValuation: { ...this.state.deal.premoneyValuation, currency },
        amountAllocatedToOrganization: {
          ...this.state.deal.amountAllocatedToOrganization,
          currency,
        },
        minTicket: { ...this.state.deal.minTicket, currency },
        maxTicket: { ...this.state.deal.maxTicket, currency },
      },
    });
  }).bind(this);
  dealCategoriesOptions = () => {
    const { dealCategories } = this.props.organization;
    return dealCategories.map(dealCategory => ({
      key: dealCategory.id,
      text: dealCategory.name,
      value: dealCategory.id,
    }));
  };
  render() {
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="large">
        <Header
          icon="file text outline"
          content={this.props.deal.id ? 'Update deal' : ' Create deal'}
        />
        <Modal.Content>
          {!this.props.deal.id &&
            <div>
              <CompanyForm onChange={this.handleCompanyChange} />
              <Header as="h3" dividing>
                Details
              </Header>
            </div>}
          <Form
            id="upsert-deal"
            onSubmit={this.onSubmit}
            error={this.state.companyIdError || this.state.categoryIdError}
          >
            <Form.Group>
              <Form.Input
                name="deal.name"
                value={this.state.deal.name}
                onChange={this.handleChange}
                label="Name"
                placeholder="Name"
                required
                width={5}
              />
              <Form.Input
                name="deal.spvName"
                value={this.state.deal.spvName}
                onChange={this.handleChange}
                label="SPV Name"
                placeholder="SPV Name"
                width={5}
              />
              <DateField
                name="deal.referenceClosingDate"
                value={this.state.deal.referenceClosingDate}
                onChange={this.handleChange}
                label="Reference closing date"
                width={6}
              />
            </Form.Group>
            <Form.TextArea
              name="deal.description"
              value={this.state.deal.description}
              onChange={this.handleChange}
              label="Description"
              placeholder="Description"
              autoHeight
            />
            <FilesField
              name="deal.deck"
              value={this.state.deal.deck}
              onChange={this.handleChange}
              label="Deck"
              multiple
            />
            <Form.Group>
              <Form.Select
                name="deal.categoryId"
                defaultValue={this.state.deal.categoryId}
                onChange={this.handleChange}
                options={this.dealCategoriesOptions()}
                label="Category"
                placeholder="Category"
                required
                width={5}
              />
              <AmountField
                name="deal.roundSize"
                value={this.state.deal.roundSize}
                onChange={this.handleChange}
                label="Size of the round"
                required
                width={5}
              />
              <AmountField
                name="deal.premoneyValuation"
                value={this.state.deal.premoneyValuation}
                onChange={this.handleChange}
                label="Premoney valuation"
                required
                width={6}
              />
            </Form.Group>
            <Form.Group>
              <AmountField
                name="deal.amountAllocatedToOrganization"
                value={this.state.deal.amountAllocatedToOrganization}
                onChange={this.handleChange}
                label={`Amount allocated to ${this.props.organization.generalSettings.name}`}
                required
                width={5}
              />
              <AmountField
                name="deal.minTicket"
                value={this.state.deal.minTicket}
                onChange={this.handleChange}
                label="Min ticket"
                required
                width={5}
              />
              <AmountField
                name="deal.maxTicket"
                value={this.state.deal.maxTicket}
                onChange={this.handleChange}
                label="Max ticket"
                placeholder="No Limit"
                width={6}
              />
            </Form.Group>
            <Form.Group>
              <PercentField
                name="deal.carried"
                value={this.state.deal.carried}
                onChange={this.handleChange}
                label="Carried"
                placeholder="Carried"
                required
                width={8}
              />
              <PercentField
                name="deal.hurdle"
                value={this.state.deal.hurdle}
                onChange={this.handleChange}
                label="Hurdle"
                placeholder="Hurdle"
                required
                width={8}
              />
            </Form.Group>
            {this.state.companyIdError &&
              <Message error header="Error!" content="Company is required." />}
            {this.state.categoryIdError &&
              <Message error header="Error!" content="Category is required." />}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            content="Cancel"
            icon="remove"
            labelPosition="left"
            onClick={this.onCancel}
          />
          <Button
            type="submit"
            form="upsert-deal"
            color="green"
            disabled={this.state.loading}
            loading={this.state.loading}
            content={this.props.deal.id ? 'Update' : 'Create'}
            icon="save"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  graphql(upsertDealMutation, {
    props: ({ mutate, ownProps: { deal } }) => ({
      upsertDeal: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            deal.shortId
              ? {
                  query: dealQuery,
                  variables: { shortId: deal.shortId },
                }
              : { query: dealsQuery },
          ],
        }),
    }),
  }),
)(UpsertDealModal);
