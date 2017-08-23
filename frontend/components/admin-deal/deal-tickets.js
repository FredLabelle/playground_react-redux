import { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';

import { DealPropType } from '../../lib/prop-types';
import DealTicketsList from './deal-tickets-list';
import UpsertTicketModal from '../common/upsert-ticket-modal';

class DealTickets extends Component {
  static propTypes = { deal: DealPropType.isRequired };
  state = { upsertTicketModalOpen: false };
  onUpsertTicketModalClose = () => {
    this.setState({ upsertTicketModalOpen: false });
  };
  createTicket = event => {
    event.preventDefault();
    this.setState({ upsertTicketModalOpen: true });
  };
  render() {
    const { deal } = this.props;
    const ticketsPlural = deal.ticketsSum.count === 1 ? '' : 's';
    return (
      <Segment>
        <Button
          type="button"
          primary
          floated="right"
          content="Add new ticket"
          icon="ticket"
          labelPosition="left"
          onClick={this.createTicket}
        />
        <h3>
          {deal.ticketsSum.count} ticket{ticketsPlural}
        </h3>
        <DealTicketsList tickets={deal.tickets} />
        <UpsertTicketModal
          open={this.state.upsertTicketModalOpen}
          onClose={this.onUpsertTicketModalClose}
          ticket={{
            amount: {
              amount: '',
              currency: deal.amountAllocatedToOrganization.currency,
            },
          }}
          deal={deal}
        />
      </Segment>
    );
  }
}

export default DealTickets;
