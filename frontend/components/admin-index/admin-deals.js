import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import Link from 'next/link';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';
import DealsList from './deals-list';

const AdminDeals = ({ router }) =>
  <Segment attached="bottom" className="tab active">
    <Segment basic textAlign="right">
      <Link prefetch href={linkHref('/deals/new', router)} as={linkAs('/deals/new', router)}>
        <Button
          type="button"
          primary
          content="Create new deal"
          icon="add square"
          labelPosition="left"
        />
      </Link>
    </Segment>
    <DealsList />
  </Segment>;
AdminDeals.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(AdminDeals);
