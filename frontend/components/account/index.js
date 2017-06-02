import { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

import { RouterPropType, MePropType } from '../../lib/prop-types';
import { meQuery } from '../../lib/queries';
import AccountTab from './account-tab';
import AdministrativeTab from './administrative-tab';
import ParametersTab from './parameters-tab';

class Account extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    me: MePropType,
  };
  static defaultProps = { me: null };
  state = { tab: this.props.router.query.tab };
  render() {
    const shortId = this.props.router.organizationShortId;
    const href = tab => `/account?shortId=${shortId}&tab=${tab}`;
    const as = tab => `/organization/${shortId}/account?tab=${tab}`;
    const active = tab => tab === (this.props.router.query.tab || 'account');
    return (
      this.props.me &&
      <div>
        <Menu attached="top" tabular widths={3}>
          <Link href={href('account')} as={as('account')}>
            <Menu.Item active={active('account')}>
              Account
            </Menu.Item>
          </Link>
          <Link href={href('administrative')} as={as('administrative')}>
            <Menu.Item active={active('administrative')}>
              Administrative
            </Menu.Item>
          </Link>
          <Link href={href('parameters')} as={as('parameters')}>
            <Menu.Item active={active('parameters')}>
              Parameters
            </Menu.Item>
          </Link>
        </Menu>
        <AccountTab active={active('account')} />
        <AdministrativeTab me={this.props.me} active={active('administrative')} />
        <ParametersTab active={active('parameters')} />
      </div>
    );
  }
}

const AccountWithGraphQL = graphql(meQuery, {
  props: ({ data: { me } }) => ({ me }),
})(Account);

const mapStateToProps = ({ router }) => ({ router });

export default connect(mapStateToProps)(AccountWithGraphQL);
