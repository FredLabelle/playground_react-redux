import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Form, Button, Header, Message } from 'semantic-ui-react';
import omit from 'lodash/omit';
import get from 'lodash/get';
import Router from 'next/router';
import moment from 'moment';

import { linkHref, linkAs } from '../../lib/url';
import { sleep, handleChange } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery, dealsQuery } from '../../lib/queries';
import { createDealMutation } from '../../lib/mutations';
import CompanyForm from './company-form';
import AmountField from '../fields/amount-field';
import FilesField from '../fields/files-field';
import DateField from '../fields/date-field';

class CreateNewDeal extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    createDeal: PropTypes.func.isRequired,
  };
  static defaultProps = {
    organization: null,
    companies: [],
  };
  state = {
    deal: {
      companyId: '',
      categoryId: '',
      name: '',
      description: '',
      deck: [],
      totalAmount: {
        amount: '',
        currency: this.props.organization.parametersSettings.investmentMechanisms.defaultCurrency,
      },
      minTicket: {
        amount: '',
        currency: this.props.organization.parametersSettings.investmentMechanisms.defaultCurrency,
      },
      maxTicket: {
        amount: '',
        currency: this.props.organization.parametersSettings.investmentMechanisms.defaultCurrency,
      },
      referenceClosingDate: moment().format('DD-MM-YYYY'),
      carried: '',
      hurdle: '',
    },
    companyIdError: false,
    categoryIdError: false,
    carriedError: false,
    loading: false,
    success: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    const companyIdError = !this.state.deal.companyId;
    const categoryIdError = !this.state.deal.categoryId;
    this.setState({ companyIdError, categoryIdError });
    if (companyIdError || categoryIdError) {
      return;
    }
    this.setState({ loading: true });
    const deal = omit(this.state.deal);
    const { data: { createDeal } } = await this.props.createDeal(deal);
    if (createDeal) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
      Router.push(linkHref('/', this.props.router), linkAs('/', this.props.router));
    } else {
      console.error('CREATE DEAL ERROR');
      this.setState({ loading: false });
    }
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
    if (!['deal.totalAmount', 'deal.minTicket', 'deal.maxTicket'].includes(name)) {
      return;
    }
    const { currency } = get(this.state, name);
    this.setState({
      deal: {
        ...this.state.deal,
        totalAmount: { ...this.state.deal.totalAmount, currency },
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
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        {!this.state.success &&
          <div>
            <Header as="h2" dividing>
              Create new deal
            </Header>
            <CompanyForm onChange={this.handleCompanyChange} />
            <Header as="h3" dividing>
              Details
            </Header>
          </div>}
        <Form
          onSubmit={this.onSubmit}
          success={this.state.success}
          error={this.state.companyIdError || this.state.categoryIdError}
        >
          {!this.state.success &&
            <div>
              <Form.Input
                name="deal.name"
                value={this.state.deal.name}
                onChange={this.handleChange}
                label="Name"
                placeholder="Name"
                required
              />
              <Form.TextArea
                name="deal.description"
                value={this.state.deal.description}
                onChange={this.handleChange}
                label="Description"
                placeholder="Description"
                autoHeight
              />
              <FilesField
                field="deal.deck"
                label="Deck"
                files={this.state.deal.deck}
                onChange={this.handleChange}
              />
              <Form.Select
                name="deal.categoryId"
                value={this.state.deal.categoryId}
                onChange={this.handleChange}
                options={this.dealCategoriesOptions()}
                label="Category"
                placeholder="Category"
                required
              />
              <AmountField
                name="deal.totalAmount"
                value={this.state.deal.totalAmount}
                onChange={this.handleChange}
                label="Total amount"
                required
              />
              <AmountField
                name="deal.minTicket"
                value={this.state.deal.minTicket}
                onChange={this.handleChange}
                label="Min ticket"
                required
              />
              <AmountField
                name="deal.maxTicket"
                value={this.state.deal.maxTicket}
                onChange={this.handleChange}
                label="Max ticket"
                placeholder="No Limit"
              />
              <DateField
                name="deal.referenceClosingDate"
                value={this.state.deal.referenceClosingDate}
                onChange={this.handleChange}
                label="Reference closing date"
              />
              <Form.Input
                name="deal.carried"
                value={this.state.deal.carried}
                onChange={this.handleChange}
                label="Carried"
                placeholder="Carried"
                type="number"
                min="0"
                max="100"
                required
              />
              <Form.Input
                name="deal.hurdle"
                value={this.state.deal.hurdle}
                onChange={this.handleChange}
                label="Hurdle"
                placeholder="Hurdle"
                type="number"
                min="0"
                max="100"
                required
              />
            </div>}
          {this.state.companyIdError &&
            <Message error header="Error!" content="Company is required." />}
          {this.state.categoryIdError &&
            <Message error header="Error!" content="Category is required." />}
          <Message success header="Success!" content="New deal created." />
          <Segment basic textAlign="center">
            <Button
              type="submit"
              primary
              disabled={this.state.loading}
              content="Create"
              icon="checkmark"
              labelPosition="left"
            />
          </Segment>
        </Form>
      </Segment>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(createDealMutation, {
    props: ({ mutate }) => ({
      createDeal: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: dealsQuery }],
        }),
    }),
  }),
)(CreateNewDeal);
