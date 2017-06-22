import { Segment } from 'semantic-ui-react';

import TicketsList from '../common/tickets-list';

const Tickets = () =>
  <Segment attached="bottom" className="tab active">
    <TicketsList />
  </Segment>;

export default Tickets;
