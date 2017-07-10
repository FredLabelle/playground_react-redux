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

input UpdateFilesInput {
  resourceId: ID!
  field: String!
  files: [FileInput]!
}

input GeneralSettingsInput {
  name: String!
  website: String!
  description: String!
  emailDomains: [String]!
}

input OrganizationInvestmentMechanismsInput {
  optOutTime: String!
  defaultCurrency: String!
}

input InvitationEmailInput {
  subject: String!
  body: String!
}

input ParametersSettingsInput {
  investmentMechanisms: OrganizationInvestmentMechanismsInput!
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

input InvitationStatusInput {
  email: String!
  organizationId: String!
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
  investmentMechanisms: [String]!
}

input ChangeEmailInput {
  password: String!
  email: String!
}

input ChangePasswordInput {
  currentPassword: String!
  password: String!
}

input UpdateDealInput {
  id: ID!
  name: String!
  description: String
  totalAmount: AmountInput!
  minTicket: AmountInput!
  maxTicket: AmountInput!
  carried: String!
  hurdle: String!
}

type Mutation {
  investorSignup(input: InvestorSignupInput!): ID
  investorLogin(input: InvestorLoginInput!): ID
  logout: Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): ID
  changeEmail(input: ChangeEmailInput!): Boolean!
  changePassword(input: ChangePasswordInput!): Boolean!
  updateInvestor(input: UpdateInvestorInput!): Boolean!
  updateInvestorFiles(input: UpdateFilesInput!): Boolean!
  adminLoginAck: Boolean!
  updateOrganization(input: UpdateOrganizationInput!): Boolean!
  updateDealCategories(input: [DealCategoryInput]!): Boolean!
  createInvestor(input: CreateInvestorInput!): Boolean!
  invitationStatus(input: InvitationStatusInput!): String!
  inviteInvestor(input: InviteInvestorInput!): String!
  upsertCompany(input: UpsertCompanyInput!): Company
  createDeal(input: CreateDealInput!): Boolean!
  createTicket(input: CreateTicketInput!): Boolean!
  updateDeal(input: UpdateDealInput!): Boolean!
  updateDealFiles(input: UpdateFilesInput!): Boolean!
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
      return authedMutation(context.User.logout, false)();
    },
    forgotPassword(root, { input }, context) {
      return context.User.forgotPassword(input);
    },
    resetPassword(root, { input }, context) {
      return authedMutation(context.User.resetPassword, false)(input);
    },
    changeEmail(root, { input }, context) {
      return authedMutation(context.User.changeEmail, false)(context.user, input);
    },
    changePassword(root, { input }, context) {
      return authedMutation(context.User.changePassword, false)(context.user, input);
    },
    updateInvestor(root, { input }, context) {
      return authedMutation(context.User.updateInvestor, false)(context.user, input);
    },
    updateInvestorFiles(root, { input }, context) {
      return authedMutation(context.User.updateInvestorFiles, false)(context.user, input);
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
      return adminMutation(context.Organization.invitationStatus, 'error')(input);
    },
    inviteInvestor(root, { input }, context) {
      return adminMutation(context.Organization.inviteInvestor, false)(context.user, input);
    },
    upsertCompany(root, { input }, context) {
      return adminMutation(context.Organization.upsertCompany, null)(context.user, input);
    },
    createDeal(root, { input }, context) {
      return adminMutation(context.Deal.create, false)(context.user, input);
    },
    createTicket(root, { input }, context) {
      return adminMutation(context.Organization.createTicket, false)(context.user, input);
    },
    updateDeal(root, { input }, context) {
      return adminMutation(context.Deal.update, false)(context.user, input);
    },
    updateDealFiles(root, { input }, context) {
      return adminMutation(context.Deal.updateFiles, false)(context.user, input);
    },
  },
};
