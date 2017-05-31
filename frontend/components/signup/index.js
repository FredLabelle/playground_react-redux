import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';

import { organization } from '../../lib/queries';
import Form from './form';

const Signup = ({ organizationShortId, dealCategories, defaultCurrency }) => (
  <Form
    organizationShortId={organizationShortId}
    dealCategories={dealCategories}
    defaultCurrency={defaultCurrency}
  />
);
Signup.propTypes = {
  organizationShortId: PropTypes.string.isRequired,
  dealCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultCurrency: PropTypes.string.isRequired,
};

const SignupWithGraphGL = graphql(organization, {
  options: ({ organizationShortId }) => ({
    variables: { shortId: organizationShortId },
  }),
  props: ({ data }) => data.organization,
})(Signup);

const mapStateToProps = ({ router }) => router;

export default connect(mapStateToProps)(SignupWithGraphGL);
