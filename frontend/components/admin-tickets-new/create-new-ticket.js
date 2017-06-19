import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Button, Form, Header, Search, Message } from 'semantic-ui-react';
import escapeRegExp from 'lodash/escapeRegExp';
import Router from 'next/router';

import { linkHref, linkAs } from '../../lib/url';
import { sleep, handleChange, numberFormatter } from '../../lib/util';
import { RouterPropType, InvestorPropType, DealPropType } from '../../lib/prop-types';
import { dealsQuery, investorsQuery, ticketsQuery } from '../../lib/queries';
import { createTicketMutation } from '../../lib/mutations';
import AmountField from '../fields/amount-field';

class CreateNewTicket extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    deals: PropTypes.arrayOf(DealPropType),
    investors: PropTypes.arrayOf(InvestorPropType),
    // eslint-disable-next-line react/no-unused-prop-types
    createTicket: PropTypes.func.isRequired,
  };
  static defaultProps = { deals: [], investors: [] };
  state = {
    ticket: {
      dealId: '',
      userId: '',
      amount: {
        amount: '',
        currency: '',
      },
    },
    dealsResults: [],
    deal: '',
    investorsResults: [],
    investor: '',
    dealIdError: false,
    userIdError: false,
    loading: false,
    success: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    const dealIdError = !this.state.ticket.dealId;
    const userIdError = !this.state.ticket.userId;
    this.setState({ dealIdError, userIdError });
    if (dealIdError || userIdError) {
      return;
    }
    this.setState({ loading: true });
    const newTicket = this.state.ticket;
    const { data: { createTicket } } = await this.props.createTicket(newTicket);
    if (createTicket) {
      this.setState({ success: true });
      await sleep(2000);
      this.setState({ success: false });
      Router.push(linkHref('/tickets', this.props.router), linkAs('/tickets', this.props.router));
    } else {
      console.error('CREATE TICKET ERROR');
      this.setState({ loading: false });
    }
  };
  getDealMinBoundary = ({ minTicket }) =>
    numberFormatter(minTicket.currency).format(minTicket.amount);
  getDealMaxBoundary = ({ maxTicket }) =>
    maxTicket.amount ? numberFormatter(maxTicket.currency).format(maxTicket.amount) : 'No Limit';
  dealTitle = deal => {
    const amount = numberFormatter(deal.totalAmount.currency).format(deal.totalAmount.amount);
    return `${deal.company.name} ${deal.category} (${amount})`;
  };
  dealToResult = deal => ({
    title: this.dealTitle(deal),
    description: '',
    image: `//logo.clearbit.com/${deal.company.domain}?size=192`,
  });
  handleDealResultSelect = (event, result) => {
    const deal = this.props.deals.find(d => this.dealTitle(d) === result.title);
    const ticket = {
      ...this.state.ticket,
      dealId: deal.id,
      amount: {
        ...this.state.ticket.amount,
        currency: deal.totalAmount.currency,
      },
    };
    this.setState({ deal: result.title, ticket });
  };
  handleDealSearchChange = (event, search) => {
    const perfectMatch = this.props.deals.find(d => this.dealTitle(d) === search);
    const deal = perfectMatch ? perfectMatch.title : search;
    const dealId = perfectMatch ? perfectMatch.id : '';
    const currency = perfectMatch ? perfectMatch.totalAmount.currency : '';
    const ticket = {
      ...this.state.ticket,
      dealId,
      amount: {
        ...this.state.ticket.amount,
        currency,
      },
    };
    const regExp = new RegExp(escapeRegExp(search), 'i');
    const isMatch = result => regExp.test(result.title);
    const deals = this.props.deals.map(this.dealToResult);
    const dealsResults = deals.filter(isMatch);
    this.setState({ ticket, dealsResults, deal });
  };
  investorToResult = investor => ({
    title: investor.fullName,
    description: investor.email,
    image: investor.pictureUrl,
  });
  handleInvestorResultSelect = (event, result) => {
    const investor = this.props.investors.find(i => i.fullName === result.title);
    const ticket = {
      ...this.state.ticket,
      userId: investor.id,
    };
    this.setState({ investor: result.title, ticket });
  };
  handleInvestorSearchChange = (event, search) => {
    const perfectMatch = this.props.investors.find(i => i.fullName === search);
    const investor = perfectMatch ? perfectMatch.title : search;
    const userId = perfectMatch ? perfectMatch.id : '';
    const ticket = {
      ...this.state.ticket,
      userId,
    };
    const regExp = new RegExp(escapeRegExp(search), 'i');
    const isMatch = result => regExp.test(result.title);
    const investors = this.props.investors.map(this.investorToResult);
    const investorsResults = investors.filter(isMatch);
    this.setState({ ticket, investorsResults, investor });
  };
  handleChange = handleChange().bind(this);
  error = () => this.state.dealIdError || this.state.userIdError;
  render() {
    const selectedDeal = this.props.deals.find(({ id }) => id === this.state.ticket.dealId);
    return (
      <Segment attached="bottom" className="tab active">
        <Form
          onSubmit={this.onSubmit}
          warning={this.state.ticket.dealId !== ''}
          success={this.state.success}
          error={this.error()}
        >
          <Header as="h2" dividing>Create new ticket</Header>
          <Form.Group>
            <Form.Field
              label="Deal"
              width={8}
              control={Search}
              onResultSelect={this.handleDealResultSelect}
              onSearchChange={this.handleDealSearchChange}
              results={this.state.dealsResults}
              value={this.state.deal}
              required
            />
            <Form.Field
              label="Investor"
              width={8}
              control={Search}
              onResultSelect={this.handleInvestorResultSelect}
              onSearchChange={this.handleInvestorSearchChange}
              results={this.state.investorsResults}
              value={this.state.investor}
              required
            />
          </Form.Group>
          <AmountField
            name="ticket.amount"
            value={this.state.ticket.amount}
            onChange={this.handleChange}
            label="Ticket amount"
            min={selectedDeal && selectedDeal.minTicket.amount}
            max={selectedDeal && selectedDeal.maxTicket.amount}
            currencyDisabled
            required
          />
          {selectedDeal &&
            <Message warning>
              <Message.Header>Ticket amount boundaries</Message.Header>
              <Message.Content>
                Min: {this.getDealMinBoundary(selectedDeal)}<br />
                Max: {this.getDealMaxBoundary(selectedDeal)}
              </Message.Content>
            </Message>}
          {this.state.dealIdError && <Message error header="Error!" content="Deal is required." />}
          {this.state.userIdError &&
            <Message error header="Error!" content="Investor is required." />}
          <Message success header="Success!" content="New ticket created." />
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
  graphql(dealsQuery, {
    props: ({ data: { deals } }) => ({
      deals: deals
        ? deals.map(deal => ({
            ...deal,
            createdAt: new Date(deal.createdAt),
          }))
        : [],
    }),
  }),
  graphql(investorsQuery, {
    props: ({ data: { investors } }) => ({
      investors: investors
        ? investors.map(investor => ({
            ...investor,
            createdAt: new Date(investor.createdAt),
          }))
        : [],
    }),
  }),
  graphql(createTicketMutation, {
    props: ({ mutate }) => ({
      createTicket: input =>
        mutate({
          variables: { input },
          refetchQueries: [{ query: ticketsQuery }],
        }),
    }),
  }),
)(CreateNewTicket);
