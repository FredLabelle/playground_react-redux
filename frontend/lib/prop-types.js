import PropTypes from 'prop-types';

export const NamePropType = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
});

export const TicketPropType = PropTypes.shape({
  amount: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
});

export const AddressPropType = PropTypes.shape({
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
});

export const FilePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  image: PropTypes.bool.isRequired,
});

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
  investmentSettings: PropTypes.shape({
    dealCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultCurrency: PropTypes.string.isRequired,
  }).isRequired,
});

export const MePropType = PropTypes.shape({
  name: NamePropType.isRequired,
  email: PropTypes.string,
  investmentSettings: PropTypes.shape({
    dealCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    averageTicket: TicketPropType.isRequired,
    mechanism: PropTypes.string.isRequired,
  }) /* .isRequired*/,
  type: PropTypes.string.isRequired,
  individualSettings: PropTypes.shape({
    birthdate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    nationality: PropTypes.string.isRequired,
    idDocument: FilePropType.isRequired,
    fiscalAddress: AddressPropType.isRequired,
  }).isRequired,
  corporationSettings: PropTypes.shape({
    position: PropTypes.string.isRequired,
    companyAddress: AddressPropType.isRequired,
    incProof: FilePropType.isRequired,
  }).isRequired,
  advisor: PropTypes.shape({
    name: NamePropType.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
});
