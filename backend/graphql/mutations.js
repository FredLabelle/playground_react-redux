exports.schema = `
input NameInput {
  firstName: String!
  lastName: String!
}

input AverageTicketInput {
  amount: String!
  currency: String!
}

input InvestmentSettingsInput {
  type: String!
  dealCategories: [String]!
  averageTicket: AverageTicketInput!
  mechanism: String!
}

input InvestorSignupInput {
  name: NameInput!
  email: String!
  password: String!
  investmentSettings: InvestmentSettingsInput!
  organizationId: String!
}

input InvestorLoginInput {
  email: String!
  password: String!
  organizationId: ID!
}

input ForgotPasswordInput {
  email: String!
  organizationId: ID!
}

input ResetPasswordInput {
  token: ID!
  password: String!
}

input AddressInput {
  address1: String!
  address2: String!
  city: String!
  zipCode: String!
  country: String!
  state: String!
}

input IndividualSettingsInput {
  birthdate: String!
  nationality: String!
  fiscalAddress: AddressInput!
}

input CorporationSettingsInput {
  position: String!
  companyName: String!
  companyAddress: AddressInput!
}

input AdvisorInput {
  name: NameInput!
  email: String!
}

input UpdateInvestorInput {
  name: NameInput!
  investmentSettings: InvestmentSettingsInput
  individualSettings: IndividualSettingsInput
  corporationSettings: CorporationSettingsInput
  advisor: AdvisorInput
}

input FileInput {
  name: String!
  url: String!
  image: Boolean!
}

input UpdateInvestorFileInput {
  field: String!
  file: FileInput!
}

input GeneralSettingsInput {
  name: String!
  website: String!
  description: String!
  emailDomains: [String]!
}

input OrganizationInvestmentSettingsInput {
  dealCategories: [String]!
  defaultCurrency: String!
}

input EmailInput {
  subject: String!
  body: String!
}

input ParametersSettingsInput {
  investment: OrganizationInvestmentSettingsInput!
  invitationEmail: EmailInput!
}

input UpdateOrganizationInput {
  generalSettings: GeneralSettingsInput
  parametersSettings: ParametersSettingsInput
}

input CreateInvestorInput {
  name: NameInput!
  email: String!
  investmentSettings: InvestmentSettingsInput!
  organizationId: String!
}

type Mutation {
  investorSignup(input: InvestorSignupInput!): ID
  investorLogin(input: InvestorLoginInput!): ID
  logout: Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): ID
  updateInvestor(input: UpdateInvestorInput!): Boolean!
  updateInvestorFile(input: UpdateInvestorFileInput!): Boolean!
  adminLoginAck: Boolean!
  updateOrganization(input: UpdateOrganizationInput!): Boolean!
  createInvestor(input: CreateInvestorInput!): Boolean!
}
`;

exports.resolvers = {
  Mutation: {
    investorSignup(root, { input }, context) {
      return context.User.signup(input);
    },
    investorLogin(root, { input }, context) {
      return context.User.login(input);
    },
    logout(root, params, context) {
      return context.User.logout();
    },
    forgotPassword(root, { input }, context) {
      return context.User.forgotPassword(input);
    },
    resetPassword(root, { input }, context) {
      return context.User.resetPassword(input);
    },
    updateInvestor(root, { input }, context) {
      return context.User.updateInvestor(context.user, input);
    },
    updateInvestorFile(root, { input }, context) {
      return context.User.updateInvestorFile(context.user, input);
    },
    adminLoginAck() {
      return true;
    },
    updateOrganization(root, { input }, context) {
      return context.Organization.update(context.user, input);
    },
    createInvestor(root, { input }, context) {
      return context.Organization.createInvestor(context.user, input);
    },
  },
};
