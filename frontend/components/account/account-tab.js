import PropTypes from 'prop-types';
import { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class AccountTab extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        Account
      </Segment>
    );
  }
}

export default AccountTab;
