import PropTypes from 'prop-types';

export const NamePropType = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
});

export const AmountPropType = PropTypes.shape({
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

export const EmailPropType = PropTypes.shape({
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
});

export const FilePropType = PropTypes.shape({
  name: PropTypes.string,
  url: PropTypes.string.isRequired,
  image: PropTypes.bool,
  uploaded: PropTypes.bool,
});

export const RouterPropType = PropTypes.shape({
  organizationShortId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  query: PropTypes.shape({
    resetPasswordToken: PropTypes.string,
    token: PropTypes.string,
    tab: PropTypes.string,
    item: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    invited: PropTypes.string,
  }).isRequired,
});

export const FormPropType = PropTypes.shape({
  unsavedChanges: PropTypes.bool.isRequired,
  passwordsMismatch: PropTypes.bool.isRequired,
  passwordTooWeak: PropTypes.bool.isRequired,
});

export const OrganizationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  shortId: PropTypes.string.isRequired,
  generalSettings: PropTypes.shape({
    name: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    emailDomains: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  domain: PropTypes.string,
});

export const UserPropType = PropTypes.shape({
  name: NamePropType,
  fullName: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  picture: PropTypes.arrayOf(FilePropType),
});

export const InvoicePropType = PropTypes.shape({
  customId: PropTypes.string,
  netAmount: AmountPropType,
  grossAmount: AmountPropType,
  purchaseOrder: PropTypes.string,
  status: PropTypes.string,
  origin: PropTypes.string,
  debtor: PropTypes.string,
  name: PropTypes.string,
});

export const PaymentPropType = PropTypes.shape({
  amount: AmountPropType,
  description: PropTypes.string,
  origin: PropTypes.string,
  status: PropTypes.string,
});
