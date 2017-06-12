import { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class UsersTab extends Component {
  onSubmit = async event => {
    event.preventDefault();
  };
  render() {
    return (
      <Segment attached="bottom" className="tab active">
        Users
      </Segment>
    );
  }
}

export default UsersTab;
