import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import escapeRegExp from 'lodash/escapeRegExp';

import { PaymentPropType } from '../../lib/prop-types';
import paymentsQuery from '../../graphql/queries/payments';
import PaymentsList from './payments-list';

class Payments extends Component {
  static propTypes = { payments: PropTypes.arrayOf(PaymentPropType).isRequired };
  state = { payments: this.props.payments };
  componentWillReceiveProps({ payments }) {
    this.setState({ payments });
  }
  render() {
    const { payments } = this.props;
    const paymentsPlural = payments.length === 1 ? '' : 's';
    return (
      <div>
        <h3 style={{ display: 'inline-block' }}>
          {payments.length} payment{paymentsPlural}
        </h3>
        <PaymentsList payments={this.state.payments} />
      </div>
    );
  }
}

export default graphql(paymentsQuery, {
  props: ({ data: { payments } }) => ({ payments: payments || [] }),
})(Payments);
