import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';
import get from 'lodash/get';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { DealPropType } from '../../lib/prop-types';
import { updateDealMutation, updateDealFilesMutation } from '../../lib/mutations';
import { dealQuery } from '../../lib/queries';
import FilesField from '../fields/files-field';
import AmountField from '../fields/amount-field';

const initialState = deal => ({
  deal: pick(deal, [
    'name',
    'description',
    'deck',
    'totalAmount',
    'minTicket',
    'maxTicket',
    'carried',
    'hurdle',
  ]),
  loading: false,
  error: false,
  success: false,
});

class UpdateDealModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deal: DealPropType.isRequired,
    updateDeal: PropTypes.func.isRequired,
    updateDealFiles: PropTypes.func.isRequired,
  };
  state = initialState(this.props.deal);
  componentWillReceiveProps({ deal }) {
    this.setState({
      deal: {
        ...this.state.deal,
        deck: deal.deck,
      },
    });
  }
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const dealOmitted = omitDeep(this.state.deal, '__typename');
    const update = {
      id: this.props.deal.id,
      ...pick(dealOmitted, [
        'name',
        'description',
        'totalAmount',
        'minTicket',
        'maxTicket',
        'carried',
        'hurdle',
      ]),
    };
    const { data: { updateDeal } } = await this.props.updateDeal(update);
    if (updateDeal) {
      this.setState({ error: false, success: true });
      await sleep(2000);
      this.onClose();
    } else {
      this.setState({ error: true, loading: false });
    }
  };
  onClose = () => {
    this.setState(initialState(this.props.deal));
    this.props.onClose();
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
  render() {
    return (
      <Modal open={this.props.open} onClose={this.onClose} size="small">
        <Header icon="file text outline" content="Update deal" />
        <Modal.Content>
          <Form
            id="update-deal"
            onSubmit={this.onSubmit}
            error={this.state.error}
            success={this.state.success}
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
                  multiple
                  resourceId={this.props.deal.id}
                  field="deck"
                  label="Deck"
                  files={this.state.deal.deck}
                  mutation={this.props.updateDealFiles}
                  mutationName="updateDealFiles"
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
            <Message error header="Error!" content="Something went wrong!" />
            <Message success header="Success!" content="Deal has been updated!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="submit"
            form="update-deal"
            color="green"
            disabled={this.state.loading}
            content="Update deal"
            icon="save"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose(
  graphql(updateDealMutation, {
    props: ({ mutate, ownProps: { deal } }) => ({
      updateDeal: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            {
              query: dealQuery,
              variables: { shortId: deal.shortId },
            },
          ],
        }),
    }),
  }),
  graphql(updateDealFilesMutation, {
    props: ({ mutate, ownProps: { deal } }) => ({
      updateDealFiles: input =>
        mutate({
          variables: { input },
          refetchQueries: [
            {
              query: dealQuery,
              variables: { shortId: deal.shortId },
            },
          ],
        }),
    }),
  }),
)(UpdateDealModal);
