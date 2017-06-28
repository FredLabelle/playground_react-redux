exports.schema = `
input NameInput {
  firstName: String!
  lastName: String!
}

input AmountInput {
  amount: String!
  currency: String!
}

input InvestorSignupInput {
  name: NameInput!
  email: String!
  password: String!
  investmentSettings: JSON!
  token: ID!
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
  type: String
  investmentSettings: JSON
  individualSettings: IndividualSettingsInput
  corporationSettings: CorporationSettingsInput
  advisor: AdvisorInput
}

input FileInput {
  name: String!
  url: String!
  image: Boolean!
}

input UpdateInvestorFilesInput {
  field: String!
  files: [FileInput]!
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

input InvitationEmailInput {
  subject: String!
  body: String!
}

input ParametersSettingsInput {
  investment: OrganizationInvestmentSettingsInput!
  invitationEmail: InvitationEmailInput!
}

input UpdateOrganizationInput {
  generalSettings: GeneralSettingsInput
  parametersSettings: ParametersSettingsInput
}

input CreateInvestorInput {
  name: NameInput!
  email: String!
  investmentSettings: JSON!
}

input InvestorInfoInput {
  name: NameInput!
  email: String!
}

input InviteInvestorInput {
  investor: InvestorInfoInput!
  invitationEmail: InvitationEmailInput!
}

input UpsertCompanyInput {
  name: String!
  website: String!
  description: String!
}

input CreateDealInput {
  companyId: ID!
  name: String!
  description: String!
  deck: [FileInput]!
  categoryId: ID!
  totalAmount: AmountInput!
  minTicket: AmountInput!
  maxTicket: AmountInput!
  referenceClosingDate: String!
  carried: String!
  hurdle: String!
}

input CreateTicketInput {
  userId: ID!
  dealId: ID!
  amount: AmountInput!
}

input DealCategoryInput {
  id: ID!
  name: String!
  investmentMethods: [String]!
}

type Mutation {
  investorSignup(input: InvestorSignupInput!): ID
  investorLogin(input: InvestorLoginInput!): ID
  logout: Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): ID
  changeEmail(input: String!): Boolean!
  changePassword(input: String!): Boolean!
  updateInvestor(input: UpdateInvestorInput!): Boolean!
  updateInvestorFiles(input: UpdateInvestorFilesInput!): Boolean!
  adminLoginAck: Boolean!
  updateOrganization(input: UpdateOrganizationInput!): Boolean!
  updateDealCategories(input: [DealCategoryInput]!): Boolean!
  createInvestor(input: CreateInvestorInput!): Boolean!
  invitationStatus(input: String!): String!
  inviteInvestor(input: InviteInvestorInput!): String!
  upsertCompany(input: UpsertCompanyInput!): Company
  createDeal(input: CreateDealInput!): Boolean!
  createTicket(input: CreateTicketInput!): Boolean!
}
`;

const authedMutation = (mutation, errorValue) => (user, input) => {
  if (!user) {
    return errorValue;
  }
  return mutation(user, input);
};

const adminMutation = (mutation, errorValue) => (user, input) => {
  if (!user) {
    return errorValue;
  }
  if (user.role !== 'admin') {
    return errorValue;
  }
  return mutation(user, input);
};

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
    changeEmail(root, { input }, context) {
      return authedMutation(context.User.changeEmail, false)(context.user, input);
    },
    changePassword(root, { input }, context) {
      return authedMutation(context.User.changePassword, false)(context.user, input);
    },
    updateInvestor(root, { input }, context) {
      return context.User.updateInvestor(context.user, input);
    },
    updateInvestorFiles(root, { input }, context) {
      return context.User.updateInvestorFiles(context.user, input);
    },
    adminLoginAck() {
      return true;
    },
    updateOrganization(root, { input }, context) {
      return adminMutation(context.Organization.update, false)(context.user, input);
    },
    updateDealCategories(root, { input }, context) {
      return adminMutation(context.Organization.updateDealCategories, false)(context.user, input);
    },
    createInvestor(root, { input }, context) {
      return adminMutation(context.Organization.createInvestor, false)(context.user, input);
    },
    invitationStatus(root, { input }, context) {
      return adminMutation(context.Organization.invitationStatus, 'error')(context.user, input);
    },
    inviteInvestor(root, { input }, context) {
      return adminMutation(context.Organization.inviteInvestor, false)(context.user, input);
    },
    upsertCompany(root, { input }, context) {
      return adminMutation(context.Organization.upsertCompany, null)(context.user, input);
    },
    createDeal(root, { input }, context) {
      return adminMutation(context.Organization.createDeal, false)(context.user, input);
    },
    createTicket(root, { input }, context) {
      return adminMutation(context.Organization.createTicket, false)(context.user, input);
    },
  },
};
