import PropTypes from 'prop-types';
import { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { Button, Form, Modal, Header, Message } from 'semantic-ui-react';
import pick from 'lodash/pick';

import { sleep, handleChange, omitDeep } from '../../lib/util';
import { DealPropType } from '../../lib/prop-types';
import { updateDealMutation } from '../../lib/mutations';
import { dealQuery } from '../../lib/queries';
import CreateUpdateDealFields, { afterHandleChange } from '../common/create-update-deal-fields';

const dealFields = [
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
];

const initialState = deal => ({
  deal: pick(deal, dealFields),
  loading: false,
  error: false,
  success: false,
});

class UpdateDealModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deal: DealPropType.isRequired,
    organizationName: PropTypes.string.isRequired,
    updateDeal: PropTypes.func.isRequired,
  };
  state = initialState(this.props.deal);
  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const dealOmitted = omitDeep(this.state.deal, '__typename');
    const update = {
      id: this.props.deal.id,
      ...pick(dealOmitted, dealFields),
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
    this.setState(initialState(this.props.deal), this.props.onClose);
  };
  handleChange = handleChange(afterHandleChange.bind(this)).bind(this);
  render() {
    return (
      <Modal open={this.props.open} onClose={this.onClose} size="fullscreen">
        <Header icon="file text outline" content="Update deal" />
        <Modal.Content>
          <Form
            id="update-deal"
            onSubmit={this.onSubmit}
            error={this.state.error}
            success={this.state.success}
          >
            {!this.state.success &&
              <CreateUpdateDealFields
                deal={this.state.deal}
                handleChange={this.handleChange}
                organizationName={this.props.organizationName}
              />}
            <Message error header="Error!" content="Something went wrong!" />
            <Message success header="Success!" content="Deal has been updated!" />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            content="Cancel"
            icon="remove"
            labelPosition="left"
            onClick={this.onClose}
          />
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
)(UpdateDealModal);
