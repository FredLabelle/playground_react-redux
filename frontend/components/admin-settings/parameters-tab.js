import PropTypes from 'prop-types';
import { Component } from 'react';
import { Segment, Sidebar, Menu, Icon } from 'semantic-ui-react';
import Router from 'next/router';

import { RouterPropType, OrganizationPropType } from '../../lib/prop-types';
import DealCategoriesParameters from './deal-categories-parameters';
import InvitationEmailParameters from './invitation-email-parameters';

class ParametersTab extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    router: RouterPropType.isRequired,
    organization: OrganizationPropType.isRequired,
  };
  onClick = event => {
    event.preventDefault();
    const shortId = this.props.organization.shortId;
    const { item } = event.target.dataset;
    Router.replace(
      `/admin/settings?shortId=${shortId}&tab=parameters&item=${item}`,
      `/admin/organization/${shortId}/settings?tab=parameters&item=${item}`,
    );
  };
  render() {
    const { dealCategories } = this.props.organization.parametersSettings.investment;
    const active = item => item === (this.props.router.query.item || 'deal-categories');
    return (
      <Segment
        attached="bottom"
        className={`tab ${this.props.active ? 'active' : ''}`}
        style={{ width: '99.99999999%' }}
      >
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} width="wide" visible vertical inverted>
            <Menu.Item
              data-item="deal-categories"
              active={active('deal-categories')}
              onClick={this.onClick}
            >
              <Icon name="tag" size="big" style={{ pointerEvents: 'none' }} />
              Deal categories<br /><br />
              <em>{dealCategories.length} categories</em>
            </Menu.Item>
            <Menu.Item
              data-item="invitation-email"
              active={active('invitation-email')}
              onClick={this.onClick}
            >
              <Icon name="mail" size="big" style={{ pointerEvents: 'none' }} />
              Invitation email<br /><br />
              <em>Customize content</em>
            </Menu.Item>
            <Menu.Item
              data-item="investment-mechanism"
              active={active('investment-mechanism')}
              onClick={this.onClick}
            >
              <Icon name="money" size="big" style={{ pointerEvents: 'none' }} />
              Investment mechanism<br /><br />
              <em>Systematic with opt-out</em>
            </Menu.Item>
            <Menu.Item
              data-item="carried-management"
              active={active('carried-management')}
              onClick={this.onClick}
            >
              <Icon name="percent" size="big" style={{ pointerEvents: 'none' }} />
              Carried management<br /><br />
              <em>Deal & investor carried</em>
            </Menu.Item>
            <Menu.Item
              data-item="transparency"
              active={active('transparency')}
              onClick={this.onClick}
            >
              <Icon name="unhide" size="big" style={{ pointerEvents: 'none' }} />
              Transparency<br /><br />
              <em>Full transparency</em>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher style={{ width: '68%', minHeight: 540 }}>
            {active('deal-categories') &&
              <DealCategoriesParameters organization={this.props.organization} />}
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

export default ParametersTab;
