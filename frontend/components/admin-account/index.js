import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import { RouterPropType, OrganizationPropType, MePropType } from '../../lib/prop-types';
import { organizationQuery, meQuery } from '../../lib/queries';
import GeneralTab from './general-tab';

class AdminAccount extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
    me: MePropType,
  };
  static defaultProps = { organization: null, me: null };
  state = { tab: this.props.router.query.tab };
  componentDidMount() {
    const { token } = this.props.router.query;
    if (token) {
      //
    }
  }
  render() {
    const shortId = this.props.router.organizationShortId;
    const href = tab => `/admin-account?shortId=${shortId}&tab=${tab}`;
    const as = tab => `/admin/organization/${shortId}/account?tab=${tab}`;
    const active = tab => tab === (this.props.router.query.tab || 'general');
    return (
      this.props.me &&
      <div>
        <Menu attached="top" tabular widths={3}>
          <Link href={href('general')} as={as('general')}>
            <Menu.Item active={active('general')}>
              Account
            </Menu.Item>
          </Link>
          <Link href={href('users')} as={as('users')}>
            <Menu.Item active={active('users')}>
              Administrative
            </Menu.Item>
          </Link>
          <Link href={href('parameters')} as={as('parameters')}>
            <Menu.Item active={active('parameters')}>
              Parameters
            </Menu.Item>
          </Link>
        </Menu>
        <GeneralTab organization={this.props.organization} active={active('general')} />
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
)(AdminAccount);
