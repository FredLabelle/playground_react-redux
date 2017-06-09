import { Component } from 'react';
import { Segment } from 'semantic-ui-react';

class AdminReports extends Component {
  static propTypes = {
    // active: PropTypes.bool.isRequired,
  };
  onSubmit = async event => {
    event.preventDefault();
  };
  render() {
    return (
      <Segment attached="bottom" className="tab active">
        Reports
      </Segment>
    );
  }
}

export default AdminReports;
