import PropTypes from 'prop-types';
import { Component } from 'react';

class AccountTab extends Component {
  static propTypes = {
    active: PropTypes.string.isRequired,
  };
  render() {
    return (
      <div className={`ui bottom attached tab segment ${this.props.active}`}>
        Account
      </div>
    );
  }
}

export default AccountTab;
