import { Segment } from 'semantic-ui-react';

import DealsList from '../common/deals-list';

const Deals = () =>
  <Segment attached="bottom" className="tab active">
    <DealsList />
  </Segment>;

export default Deals;
