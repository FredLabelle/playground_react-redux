import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import escapeRegExp from 'lodash/escapeRegExp';

import { InvoicePropType } from '../../lib/prop-types';
import invoicesQuery from '../../graphql/queries/invoices';
import InvoicesList from './invoices-list';

class Invoices extends Component {
  static propTypes = { invoices: PropTypes.arrayOf(InvoicePropType).isRequired };
  state = { invoices: this.props.invoices };
  componentWillReceiveProps({ invoices }) {
    this.setState({ invoices });
  }
  render() {
    const { invoices } = this.props;
    const invoicesPlural = invoices.length === 1 ? '' : 's';
    return (
      <div style={{ margin: '5px', paddingBottom: '50px'}}>
        <h3 style={{ display: 'inline-block' }}>
          {invoices.length} invoice{invoicesPlural}
        </h3>
        <InvoicesList invoices={this.state.invoices} />
      </div>
    );
  }
}

export default graphql(invoicesQuery, {
  props: ({ data: { invoices } }) => ({ invoices: invoices || [] }),
})(Invoices);
