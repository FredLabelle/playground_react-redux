import { connect } from 'react-redux';
import { Segment, Button } from 'semantic-ui-react';
import Link from 'next/link';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType } from '../../lib/prop-types';
import InvestorsList from './investors-list';

const AdminInvestors = ({ router }) =>
  <Segment attached="bottom" className="tab active">
    <Segment basic textAlign="right">
      <Link
        prefetch
        href={linkHref('/investors/new', router)}
        as={linkAs('/investors/new', router)}
      >
        <Button primary content="Create new investor" />
      </Link>
    </Segment>
    <InvestorsList />
  </Segment>;
AdminInvestors.propTypes = { router: RouterPropType.isRequired };

export default connect(({ router }) => ({ router }))(AdminInvestors);
