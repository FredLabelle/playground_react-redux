import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Segment } from 'semantic-ui-react';


class AdminGeneral extends Component {
  render() {
    return (
      <Segment attached="bottom" className="tab active">
        Stuff
      </Segment>
    );
  }
}

export default compose(
  connect(({ router }) => ({ router }))
)(AdminGeneral);
