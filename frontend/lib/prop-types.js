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

export const FilePropType = PropTypes.shape({
  name: PropTypes.string,
  url: PropTypes.string.isRequired,
  image: PropTypes.bool,
  processed: PropTypes.bool,
});

export const TicketsSumPropType = PropTypes.shape({
  count: PropTypes.number,
  sum: AmountPropType,
});

export const InvestorPropType = PropTypes.shape({
  pictureUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  email: PropTypes.string,
  status: PropTypes.string,
  ticketsSum: TicketsSumPropType,
  createdAt: PropTypes.instanceOf(Date),
  updatedAt: PropTypes.instanceOf(Date),
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
  }).isRequired,
});

export const FormPropType = PropTypes.shape({
  unsavedChanges: PropTypes.bool.isRequired,
  passwordsMismatch: PropTypes.bool.isRequired,
  passwordTooWeak: PropTypes.bool.isRequired,
});

export const CompanyPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  website: PropTypes.string,
  domain: PropTypes.string.isRequired,
});

export const DealCategoryPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  investmentMechanisms: PropTypes.arrayOf(PropTypes.string),
});

export const DealPropType = PropTypes.shape({
  id: PropTypes.string,
  company: CompanyPropType.isRequired,
  category: DealCategoryPropType.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  totalAmount: AmountPropType.isRequired,
  ticketsSum: TicketsSumPropType,
  investorsCommited: PropTypes.number,
  createdAt: PropTypes.instanceOf(Date),
});

export const TicketPropType = PropTypes.shape({
  investor: InvestorPropType.isRequired,
  deal: DealPropType,
  amount: AmountPropType.isRequired,
  createdAt: PropTypes.instanceOf(Date),
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
  parametersSettings: PropTypes.shape({
    investmentMechanisms: PropTypes.shape({
      optOutTime: PropTypes.string.isRequired,
      defaultCurrency: PropTypes.string.isRequired,
    }).isRequired,
    invitationEmail: PropTypes.shape({
      subject: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  domain: PropTypes.string,
});

export const MePropType = PropTypes.shape({
  name: NamePropType,
  email: PropTypes.string,
  role: PropTypes.string,
  picture: PropTypes.arrayOf(FilePropType),
  type: PropTypes.string,
  investmentSettings: PropTypes.shape(),
  individualSettings: PropTypes.shape({
    birthdate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    nationality: PropTypes.string.isRequired,
    idDocuments: PropTypes.arrayOf(FilePropType).isRequired,
    fiscalAddress: AddressPropType.isRequired,
  }),
  corporationSettings: PropTypes.shape({
    position: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    companyAddress: AddressPropType.isRequired,
    incProof: PropTypes.arrayOf(FilePropType).isRequired,
  }),
  advisor: PropTypes.shape({
    name: NamePropType.isRequired,
    email: PropTypes.string.isRequired,
  }),
});
