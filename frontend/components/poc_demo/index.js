import Payments from '../payments';
import Invoices from '../invoices';
import { Segment } from 'semantic-ui-react';

export default () => (
  <Segment attached="bottom" className="tab active">
    <Invoices />
    <Payments />
  </Segment>
);
