import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Link from 'next/link';

import { meQuery } from '../../lib/queries';

import AccountTab from './account-tab';
import AdministrativeTab from './administrative-tab';
import ParametersTab from './parameters-tab';

class Account extends Component {
  static propTypes = {
    organizationShortId: PropTypes.string.isRequired,
    query: PropTypes.shape({
      tab: PropTypes.string,
    }).isRequired,
    me: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
    }),
  };
  static defaultProps = { me: null };
  state = { tab: this.props.query.tab };
  render() {
    const href = tab => `/account?shortId=${this.props.organizationShortId}&tab=${tab}`;
    const as = tab => `/organization/${this.props.organizationShortId}/account?tab=${tab}`;
    const active = tab => tab === (this.props.query.tab || 'account') ? 'active' : '';
    return this.props.me && (
      <div>
        <div className="ui top attached tabular three item menu">
          <Link href={href('account')} as={as('account')}>
            <a className={`item ${active('account')}`}>Account</a>
          </Link>
          <Link href={href('administrative')} as={as('administrative')}>
            <a className={`item ${active('administrative')}`}>Administrative</a>
          </Link>
          <Link href={href('parameters')} as={as('parameters')}>
            <a className={`item ${active('parameters')}`}>Parameters</a>
          </Link>
        </div>
        <AccountTab active={active('account')} />
        <AdministrativeTab me={this.props.me} active={active('administrative')} />
        <ParametersTab active={active('parameters')} />
      </div>
    );
  }
}

const AccountWithGraphQL = graphql(meQuery, {
  props: ({ data }) => ({ me: data.me }),
})(Account);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(AccountWithGraphQL);
