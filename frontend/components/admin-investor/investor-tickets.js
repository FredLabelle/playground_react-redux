import { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';

import { InvestorPropType } from '../../lib/prop-types';
import InvestorTicketsList from './investor-tickets-list';
import UpsertTicketModal from '../common/upsert-ticket-modal';

class InvestorTickets extends Component {
  static propTypes = { investor: InvestorPropType.isRequired };
  state = { upsertTicketModalOpen: false };
  onUpsertTicketModalClose = () => {
    this.setState({ upsertTicketModalOpen: false });
  };
  createTicket = event => {
    event.preventDefault();
    this.setState({ upsertTicketModalOpen: true });
  };
  render() {
    const { investor } = this.props;
    const ticketsPlural = investor.ticketsSum.count === 1 ? '' : 's';
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
          {investor.ticketsSum.count} ticket{ticketsPlural}
        </h3>
        <InvestorTicketsList tickets={investor.tickets} />
        <UpsertTicketModal
          open={this.state.upsertTicketModalOpen}
          onClose={this.onUpsertTicketModalClose}
          ticket={{
            amount: {
              amount: '',
              currency: '',
            },
          }}
          investor={investor}
        />
      </Segment>
    );
  }
}

export default InvestorTickets;
