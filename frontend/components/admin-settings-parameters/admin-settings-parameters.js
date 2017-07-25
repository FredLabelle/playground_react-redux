import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment, Sidebar, Menu, Icon } from 'semantic-ui-react';
import { stringify } from 'querystring';
import Link from 'next/link';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import organizationQuery from '../../graphql/queries/organization.gql';
import DealCategoriesParameters from './deal-categories-parameters';
import InvestmentMechanismsParameters from './investment-mechanisms-parameters';
import InvitationEmailParameters from './invitation-email-parameters';

class AdminSettingsParameters extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType,
  };
  static defaultProps = { organization: null };
  render() {
    if (!this.props.organization) {
      return null;
    }
    const { dealCategories, shortId: organizationShortId } = this.props.organization;
    const queryString = item => stringify({ organizationShortId, item });
    const href = item => `/admin/settings/parameters?${queryString(item)}`;
    const parametersPathname = `/admin/organization/${organizationShortId}/settings/parameters`;
    const as = item => `${parametersPathname}?item=${item}`;
    const active = item => item === (this.props.router.query.item || 'deal-categories');
    return (
      <Segment attached="bottom" className="tab active" style={{ width: '99.9999%' }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} visible vertical style={{ width: 240 }}>
            <Link replace href={href('deal-categories')} as={as('deal-categories')}>
              <Menu.Item active={active('deal-categories')}>
                <Icon name="tag" size="big" style={{ pointerEvents: 'none' }} />
                Deal categories<br />
                <br />
                <em>{dealCategories.length} categories</em>
              </Menu.Item>
            </Link>
            <Link replace href={href('investment-mechanisms')} as={as('investment-mechanisms')}>
              <Menu.Item active={active('investment-mechanisms')}>
                <Icon name="money" size="big" style={{ pointerEvents: 'none' }} />
                Investment mechanisms<br />
                <br />
                <em>Options for mechanisms</em>
              </Menu.Item>
            </Link>
            <Link replace href={href('invitation-email')} as={as('invitation-email')}>
              <Menu.Item active={active('invitation-email')}>
                <Icon name="mail" size="big" style={{ pointerEvents: 'none' }} />
                Invitation email<br />
                <br />
                <em>Customize content</em>
              </Menu.Item>
            </Link>
            <Link replace href={href('carried-management')} as={as('carried-management')}>
              <Menu.Item active={active('carried-management')}>
                <Icon name="percent" size="big" style={{ pointerEvents: 'none' }} />
                Carried management<br />
                <br />
                <em>Deal & investor carried</em>
              </Menu.Item>
            </Link>
            <Link replace href={href('transparency')} as={as('transparency')}>
              <Menu.Item active={active('transparency')}>
                <Icon name="unhide" size="big" style={{ pointerEvents: 'none' }} />
                Transparency<br />
                <br />
                <em>Full transparency</em>
              </Menu.Item>
            </Link>
          </Sidebar>
          <Sidebar.Pusher style={{ width: '74%', minHeight: 540 }}>
            {active('deal-categories') &&
              <DealCategoriesParameters organization={this.props.organization} />}
            {active('investment-mechanisms') &&
              <InvestmentMechanismsParameters organization={this.props.organization} />}
            {active('invitation-email') &&
              <InvitationEmailParameters organization={this.props.organization} />}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <style jsx>{`
          em {
            pointer-events: none;
          }
        `}</style>
      </Segment>
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
)(AdminSettingsParameters);
