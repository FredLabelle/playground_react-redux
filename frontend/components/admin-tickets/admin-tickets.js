import { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';

import TicketsList from '../common/tickets-list';
import UpsertTicketModal from '../common/upsert-ticket-modal';

export default class extends Component {
  state = { upsertTicketModalOpen: false };
  onUpsertTicketModalClose = () => {
    this.setState({ upsertTicketModalOpen: false });
  };
  createTicket = event => {
    event.preventDefault();
    this.setState({ upsertTicketModalOpen: true });
  };
  render() {
    return (
      <Segment attached="bottom" className="tab active">
        <Segment basic textAlign="right">
          <Button
            type="button"
            primary
            content="Create new ticket"
            icon="ticket"
            labelPosition="left"
            onClick={this.createTicket}
          />
        </Segment>
        <TicketsList />
        <UpsertTicketModal
          open={this.state.upsertTicketModalOpen}
          onClose={this.onUpsertTicketModalClose}
          ticket={{
            dealId: '',
            userId: '',
            amount: {
              amount: '',
              currency: '',
            },
          }}
        />
      </Segment>
    );
  }
}
