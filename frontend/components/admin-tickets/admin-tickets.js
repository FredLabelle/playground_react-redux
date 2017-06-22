import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import Link from 'next/link';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';
import TicketsList from '../common/tickets-list';

const AdminTickets = ({ router }) =>
  <Segment attached="bottom" className="tab active">
    <Segment basic textAlign="right">
      <Link prefetch href={linkHref('/tickets/new', router)} as={linkAs('/tickets/new', router)}>
        <Button
          type="button"
          primary
          content="Create new ticket"
          icon="ticket"
          labelPosition="left"
        />
      </Link>
    </Segment>
    <TicketsList />
  </Segment>;
AdminTickets.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(AdminTickets);
