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

export const IdDocumentPropType = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  number: PropTypes.string,
  expirationDate: PropTypes.string,
  files: PropTypes.arrayOf(FilePropType),
});

export const TicketsSumPropType = PropTypes.shape({
  count: PropTypes.number,
  sum: AmountPropType,
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

export const CompanyPropType = PropTypes.shape({
  name: PropTypes.string,
  website: PropTypes.string,
  domain: PropTypes.string,
});

export const DealCategoryPropType = PropTypes.shape({
  name: PropTypes.string,
  investmentMechanisms: PropTypes.arrayOf(PropTypes.string),
});

export const DealPropType = PropTypes.shape({
  id: PropTypes.string,
  shortId: PropTypes.string,
  company: CompanyPropType,
  category: DealCategoryPropType,
  name: PropTypes.string,
  spvName: PropTypes.string,
  description: PropTypes.string,
  roundSize: AmountPropType,
  premoneyValuation: AmountPropType,
  amountAllocatedToOrganization: AmountPropType,
  minTicket: AmountPropType,
  maxTicket: AmountPropType,
  referenceClosingDate: PropTypes.string,
  carried: PropTypes.string,
  hurdle: PropTypes.string,
  ticketsSum: TicketsSumPropType,
  investorsCommited: PropTypes.number,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});

export const ReportPropType = PropTypes.shape({
  id: PropTypes.string,
  senderName: PropTypes.string,
  senderEmail: PropTypes.string,
  replyTo: PropTypes.string,
  email: EmailPropType,
  attachments: PropTypes.arrayOf(FilePropType),
  cc: PropTypes.arrayOf(PropTypes.string),
  bcc: PropTypes.arrayOf(PropTypes.string),
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
    invitationEmail: EmailPropType.isRequired,
  }).isRequired,
  domain: PropTypes.string,
});

export const InvestorPropType = PropTypes.shape({
  name: NamePropType,
  fullName: PropTypes.string,
  phone1: PropTypes.string,
  phone2: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  picture: PropTypes.arrayOf(FilePropType),
  type: PropTypes.string,
  investmentSettings: PropTypes.shape(),
  individualSettings: PropTypes.shape({
    birthdate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    nationality: PropTypes.string.isRequired,
    idDocuments: PropTypes.arrayOf(IdDocumentPropType).isRequired,
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

export const TicketPropType = PropTypes.shape({
  investor: InvestorPropType,
  deal: DealPropType,
  amount: AmountPropType.isRequired,
  status: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
});

export const AdminPropType = PropTypes.shape({
  name: NamePropType,
  fullName: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  picture: PropTypes.arrayOf(FilePropType),
});
