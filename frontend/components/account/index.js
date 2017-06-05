import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

import { RouterPropType, OrganizationPropType, MePropType } from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import AccountTab from './account-tab';
import AdministrativeTab from './administrative-tab';
import ParametersTab from './parameters-tab';

class Account extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    me: MePropType,
  };
  static defaultProps = { organization: null, me: null };
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
        <AccountTab
          me={this.props.me}
          organization={this.props.organization}
          active={active('account')}
        />
        <AdministrativeTab me={this.props.me} active={active('administrative')} />
        <ParametersTab active={active('parameters')} />
      </div>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(meQuery, {
    props: ({ data: { me } }) => ({ me }),
  }),
)(Account);
