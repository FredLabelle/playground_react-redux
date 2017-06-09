import PropTypes from 'prop-types';
import { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class ParametersTab extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
  };
  onSubmit = async event => {
    event.preventDefault();
  };
  render() {
    return (
      <Segment attached="bottom" className={`tab ${this.props.active ? 'active' : ''}`}>
        Parameters
      </Segment>
    );
  }
}

export default ParametersTab;
