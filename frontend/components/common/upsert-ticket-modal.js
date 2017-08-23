import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Modal, Header, Form, Search, Message, Button } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';
import escapeRegExp from 'lodash/escapeRegExp';

import { handleChange, omitDeep, formatAmount } from '../../lib/util';
import { TicketPropType, DealPropType, InvestorPropType } from '../../lib/prop-types';
import {
  dealsQuery,
  investorsQuery,
  ticketsQuery,
  dealQuery,
  investorQuery,
} from '../../lib/queries';
import { upsertTicketMutation } from '../../lib/mutations';
import AmountField from '../fields/amount-field';

const dealTitle = ({ company, name, category }) => `${company.name} ${name} ${category.name}`;

const dealToResult = deal => ({
  title: dealTitle(deal),
  description: formatAmount(deal.amountAllocatedToOrganization),
  image: `//logo.clearbit.com/${deal.company.domain}?size=192`,
});

const investorTitle = ({ fullName, email }) => (fullName === ' ' ? email : fullName);

const investorToResult = investor => ({
  title: investorTitle(investor),
  description: investor.email,
  image: investor.picture[0].url,
});

const initialState = ({ ticket, deals, investors, deal, investor }) => ({
  ticket: {
    ...pick(ticket, ['id', 'amount']),
    dealId: deal ? deal.id : ticket.deal && ticket.deal.id,
    investorId: investor ? investor.id : ticket.investor && ticket.investor.id,
  },
  dealsResults: deals.map(dealToResult),
  deal: deal ? '' : ticket.deal && dealTitle(ticket.deal),
  dealSearchOpen: false,
  investorsResults: investors.map(investorToResult),
  investor: investor ? '' : ticket.investor && investorTitle(ticket.investor),
  investorSearchOpen: false,
  dealIdError: false,
  investorIdError: false,
  loading: false,
});

class UpsertTicketModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ticket: TicketPropType.isRequired,
    deals: PropTypes.arrayOf(DealPropType).isRequired,
    investors: PropTypes.arrayOf(InvestorPropType).isRequired,
    upsertTicket: PropTypes.func.isRequired,
    deal: DealPropType,
    investor: InvestorPropType,
  };
  static defaultProps = { deal: null, investor: null };
  state = initialState(this.props);
  componentWillReceiveProps(nextProps) {
    this.setState(initialState(nextProps));
  }
  onCancel = () => {
    this.setState(initialState(this.props));
    this.props.onClose();
  };
  onSubmit = async event => {
    event.preventDefault();
    if (!this.props.ticket.id) {
      const dealIdError = !this.state.ticket.dealId;
      const investorIdError = !this.state.ticket.investorId;
      this.setState({ dealIdError, investorIdError });
      if (dealIdError || investorIdError) {
        return;
      }
    }
    const ticket = omitDeep(this.state.ticket, '__typename');
    this.setState({ loading: true });
    const { data: { upsertTicket } } = await this.props.upsertTicket(ticket);
    this.setState({ loading: false });
    if (upsertTicket) {
      toastr.success('Success!', this.props.ticket.id ? 'Ticket updated.' : 'Ticket created.');
      this.onCancel();
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  onDealSearchFocus = () => {
    this.setState({ dealSearchOpen: true });
  };
  onDealSearchBlur = () => {
    setTimeout(() => {
      this.setState({ dealSearchOpen: false });
    }, 200);
  };
  onInvestorSearchFocus = () => {
    this.setState({ investorSearchOpen: true });
  };
  onInvestorSearchBlur = () => {
    setTimeout(() => {
      this.setState({ investorSearchOpen: false });
    }, 200);
  };
  getDealMinBoundary = ({ minTicket }) => formatAmount(minTicket);
  getDealMaxBoundary = ({ maxTicket, amountAllocatedToOrganization }) =>
    maxTicket.amount ? formatAmount(maxTicket) : formatAmount(amountAllocatedToOrganization);
  handleDealResultSelect = (event, { result }) => {
    const deal = this.props.deals.find(d => dealTitle(d) === result.title);
    const ticket = {
      ...this.state.ticket,
      dealId: deal.id,
      amount: {
        ...this.state.ticket.amount,
        currency: deal.amountAllocatedToOrganization.currency,
      },
    };
    this.setState({ deal: result.title, ticket, dealSearchOpen: false });
  };
  handleDealSearchChange = (event, { value }) => {
    const perfectMatch = this.props.deals.find(d => dealTitle(d) === value);
    const deal = perfectMatch ? perfectMatch.title : value;
    const dealId = perfectMatch ? perfectMatch.id : '';
    const currency = perfectMatch ? perfectMatch.amountAllocatedToOrganization.currency : '';
    const ticket = {
      ...this.state.ticket,
      dealId,
      amount: {
        ...this.state.ticket.amount,
        currency,
      },
    };
    const regExp = new RegExp(escapeRegExp(value), 'i');
    const isMatch = result => regExp.test(result.title);
    const deals = this.props.deals.map(dealToResult);
    const dealsResults = deals.filter(isMatch);
    this.setState({ ticket, dealsResults, deal });
  };
  handleInvestorResultSelect = (event, { result }) => {
    const investor = this.props.investors.find(i => investorTitle(i) === result.title);
    const ticket = {
      ...this.state.ticket,
      investorId: investor.id,
    };
    this.setState({ investor: result.title, ticket, investorSearchOpen: false });
  };
  handleInvestorSearchChange = (event, { value }) => {
    const perfectMatch = this.props.investors.find(i => i.fullName === value);
    const investor = perfectMatch ? perfectMatch.title : value;
    const investorId = perfectMatch ? perfectMatch.id : '';
    const ticket = {
      ...this.state.ticket,
      investorId,
    };
    const regExp = new RegExp(escapeRegExp(value), 'i');
    const isMatch = result => regExp.test(result.title) || regExp.test(result.description);
    const investors = this.props.investors.map(investorToResult);
    const investorsResults = investors.filter(isMatch);
    this.setState({ ticket, investorsResults, investor });
  };
  handleChange = handleChange().bind(this);
  render() {
    const selectedDeal = this.props.deals.find(({ id }) => id === this.state.ticket.dealId);
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="large">
        <Header
          icon="ticket"
          content={this.props.ticket.id ? 'Edit ticket' : 'Create a new ticket'}
        />
        <Modal.Content>
          <Form
            id="upsert-ticket"
            onSubmit={this.onSubmit}
            warning={this.state.ticket.dealId !== ''}
            error={this.state.dealIdError || this.state.investorIdError}
          >
            <Form.Group>
              {!this.props.deal &&
                <Form.Field
                  label="Deal"
                  width={this.props.investor ? 16 : 8}
                  control={Search}
                  onResultSelect={this.handleDealResultSelect}
                  onSearchChange={this.handleDealSearchChange}
                  results={this.state.dealsResults}
                  value={this.state.deal}
                  required
                  open={this.state.dealSearchOpen}
                  onFocus={this.onDealSearchFocus}
                  onBlur={this.onDealSearchBlur}
                />}
              {!this.props.investor &&
                <Form.Field
                  label="Investor"
                  width={this.props.deal ? 16 : 8}
                  control={Search}
                  onResultSelect={this.handleInvestorResultSelect}
                  onSearchChange={this.handleInvestorSearchChange}
                  results={this.state.investorsResults}
                  value={this.state.investor}
                  required
                  open={this.state.investorSearchOpen}
                  onFocus={this.onInvestorSearchFocus}
                  onBlur={this.onInvestorSearchBlur}
                />}
            </Form.Group>
            <AmountField
              name="ticket.amount"
              value={this.state.ticket.amount}
              onChange={this.handleChange}
              label="Ticket amount"
              // TODO validate boundaries (on submit) in investor ticket creation only
              // min={selectedDeal && selectedDeal.minTicket.amount}
              // max={selectedDeal && selectedDeal.maxTicket.amount}
              currencyDisabled
              required
            />
            {selectedDeal &&
              <Message warning>
                <Message.Header>Ticket amount boundaries</Message.Header>
                <Message.Content>
                  Min: {this.getDealMinBoundary(selectedDeal)}
                  <br />
                  Max: {this.getDealMaxBoundary(selectedDeal)}
                </Message.Content>
              </Message>}
            {this.state.dealIdError &&
              <Message error header="Error!" content="Deal is required." />}
            {this.state.investorIdError &&
              <Message error header="Error!" content="Investor is required." />}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            onClick={this.onCancel}
            content="Cancel"
            icon="remove"
            labelPosition="left"
          />
          <Button
            type="submit"
            form="upsert-ticket"
            primary
            disabled={this.state.loading}
            loading={this.state.loading}
            content={this.props.ticket.id ? 'Update' : 'Create'}
            icon="checkmark"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const refetchQueries = (deal, investor) => {
  if (deal) {
    return [{ query: dealQuery, variables: { shortId: deal.shortId } }];
  }
  if (investor) {
    return [{ query: investorQuery, variables: { shortId: investor.shortId } }];
  }
  return [{ query: ticketsQuery }];
};

export default compose(
  connect(({ router }) => ({ router })),
  graphql(dealsQuery, {
    props: ({ data: { deals } }) => ({ deals: deals || [] }),
  }),
  graphql(investorsQuery, {
    props: ({ data: { investors } }) => ({ investors: investors || [] }),
  }),
  graphql(upsertTicketMutation, {
    props: ({ mutate, ownProps: { deal, investor } }) => ({
      upsertTicket: input =>
        mutate({
          variables: { input },
          refetchQueries: refetchQueries(deal, investor),
        }),
    }),
  }),
)(UpsertTicketModal);
