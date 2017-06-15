import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Form, Button, Header, Message, Select } from 'semantic-ui-react';
import omit from 'lodash/omit';
import get from 'lodash/get';
import Router from 'next/router';

import { linkHref, linkAs } from '../../lib/url';
import { sleep, handleChange } from '../../lib/util';
import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import { organizationQuery, dealsQuery } from '../../lib/queries';
import { createDealMutation } from '../../lib/mutations';
import CompanyForm from './company-form';
import AmountField from '../fields/amount-field';
import FileField from '../fields/file-field';

class CreateNewDeal extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    // eslint-disable-next-line react/no-unused-prop-types
    createDeal: PropTypes.func.isRequired,
  };
  static defaultProps = {
    organization: null,
    companies: [],
  };
  state = {
    deal: {
      companyId: '',
      category: '',
      totalAmount: {
        amount: '',
        currency: this.props.organization.parametersSettings.investment.defaultCurrency,
      },
      minTicket: {
        amount: '',
        currency: this.props.organization.parametersSettings.investment.defaultCurrency,
      },
      maxTicket: {
        amount: '',
        currency: this.props.organization.parametersSettings.investment.defaultCurrency,
      },
      carried: '',
      deck: {
        name: '',
        url: '',
        image: false,
      },
      description: '',
    },
    companyIdError: false,
    categoryError: false,
    carriedError: false,
    loading: false,
    success: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    const companyIdError = !this.state.deal.companyId;
    const categoryError = !this.state.deal.category;
    const carriedError = !this.state.deal.carried;
    this.setState({ companyIdError, categoryError, carriedError });
    if (companyIdError || categoryError || carriedError) {
      return;
    }
    this.setState({ loading: true });
    const deal = omit(this.state.deal);
    const { data: { createDeal } } = await this.props.createDeal(deal);
    if (createDeal) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
      Router.push(linkHref('/deals', this.props.router), linkAs('/deals', this.props.router));
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
    const { dealCategories } = this.props.organization.parametersSettings.investment;
    return dealCategories.map(dealCategory => ({
      key: dealCategory,
      text: dealCategory,
      value: dealCategory,
    }));
  };
  carriedOptions = () =>
    [10, 20, 30, 40, 50].map(value => ({
      key: value,
      text: `${value}%`,
      value: `${value}`,
    }));
  error = () => {
    const { companyIdError, categoryError, carriedError } = this.state;
    return companyIdError || categoryError || carriedError;
  };
  render() {
    return (
      this.props.organization &&
      <Segment attached="bottom" className="tab active">
        <Header as="h2" dividing>Create new deal</Header>
        <CompanyForm onChange={this.handleCompanyChange} />
        <Form onSubmit={this.onSubmit} success={this.state.success} error={this.error()}>
          <Form.Field
            name="deal.category"
            value={this.state.deal.category}
            onChange={this.handleChange}
            control={Select}
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
          <Form.Field
            name="deal.carried"
            value={this.state.deal.carried}
            onChange={this.handleChange}
            control={Select}
            options={this.carriedOptions()}
            label="Carried"
            placeholder="Carried"
            required
          />
          <FileField
            field="deal.deck"
            label="Deck"
            file={this.state.deal.deck}
            onChange={this.handleChange}
          />
          <Form.TextArea
            name="deal.description"
            value={this.state.deal.description}
            onChange={this.handleChange}
            label="Description"
            placeholder="Description"
            autoHeight
          />
          {this.state.companyIdError &&
            <Message error header="Error!" content="Company is required." />}
          {this.state.categoryError &&
            <Message error header="Error!" content="Category is required." />}
          {this.state.carriedError &&
            <Message error header="Error!" content="Carried is required." />}
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
