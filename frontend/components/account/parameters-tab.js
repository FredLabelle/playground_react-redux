import PropTypes from 'prop-types';
import { Component } from 'react';

class ParametersTab extends Component {
  static propTypes = {
    active: PropTypes.string.isRequired,
  };
  render() {
    return (
      <div className={`ui bottom attached tab segment ${this.props.active}`}>
        Parameters
      </div>
    );
  }
}

export default ParametersTab;
