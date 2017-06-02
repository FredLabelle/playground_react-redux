import PropTypes from 'prop-types';

export const RouterPropType = PropTypes.shape({
  organizationShortId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  query: PropTypes.shape({
    token: PropTypes.string,
    tab: PropTypes.string,
  }).isRequired,
});

export const OrganizationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  shortId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  dealCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultCurrency: PropTypes.string.isRequired,
});

export const MePropType = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  birthdate: PropTypes.string.isRequired,
  nationality: PropTypes.string.isRequired,
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  advisorFullName: PropTypes.string.isRequired,
  advisorEmail: PropTypes.string.isRequired,
});
