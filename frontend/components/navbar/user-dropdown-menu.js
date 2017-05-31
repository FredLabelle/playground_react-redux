import PropTypes from 'prop-types';
// import { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { logout as logoutAction } from '../../actions/auth';

/* class UserDropdownMenu extends Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
  };
  onClick = () => {
    this.props.logout();
  };
  render() {
    return (
      <Dropdown item text={this.props.firstName}>
        <Dropdown.Menu>
          <Dropdown.Item>My Account</Dropdown.Item>
          <Dropdown.Item onClick={this.onClick}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}*/

const UserDropdownMenu = ({ firstName, logout }) => (
  <Dropdown item text={firstName}>
    <Dropdown.Menu>
      <Dropdown.Item>My Account</Dropdown.Item>
      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);
UserDropdownMenu.propTypes = {
  firstName: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(null, { logout: logoutAction })(UserDropdownMenu);
