import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { me as meQuery } from '../../lib/queries';

const Index = ({ me }) =>
  me &&
  <div>
    <h1>Hello {me.firstName}</h1>
  </div>;
Index.propTypes = {
  me: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
  }),
};

export default graphql(meQuery, {
  props: ({ data }) => ({ me: data.me }),
})(Index);
