import { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class SettingsParameters extends Component {
  onSubmit = async event => {
    event.preventDefault();
  };
  render() {
    return (
      <Segment attached="bottom" className="tab active">
        Parameters
      </Segment>
    );
  }
}

export default SettingsParameters;
