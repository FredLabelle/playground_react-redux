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
  idDocuments: [FileInput]!
  fiscalAddress: AddressInput!
}

input CorporationSettingsInput {
  position: String!
  companyName: String!
  companyAddress: AddressInput!
  incProof: [FileInput]!
}

input AdvisorInput {
  name: NameInput!
  email: String!
}

input FileInput {
  name: String!
  url: String!
  image: Boolean!
  uploaded: Boolean!
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

input UpsertInvestorInput {
  id: ID
  email: String
  phone: String
  name: NameInput
  picture: [FileInput]
  investmentSettings: JSON
  type: String
  individualSettings: IndividualSettingsInput
  corporationSettings: CorporationSettingsInput
  advisor: AdvisorInput
}

input InvestorInfoInput {
  name: NameInput
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
  id: ID
  name: String!
  website: String!
  description: String!
}

input UpsertDealInput {
  id: ID
  companyId: ID
  name: String!
  spvName: String
  description: String
  deck: [FileInput]!
  categoryId: ID
  roundSize: AmountInput!
  premoneyValuation: AmountInput!
  amountAllocatedToOrganization: AmountInput!
  minTicket: AmountInput!
  maxTicket: AmountInput!
  referenceClosingDate: String
  carried: String!
  hurdle: String!
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

input UpsertTicketInput {
  id: ID
  investorId: ID
  dealId: ID
  amount: AmountInput!
}

type Mutation {
  investorSignup(input: InvestorSignupInput!): ID
  investorLogin(input: InvestorLoginInput!): ID
  logout: Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): ID
  changeEmail(input: ChangeEmailInput!): Boolean!
  changePassword(input: ChangePasswordInput!): Boolean!
  adminLoginAck: Boolean!
  updateOrganization(input: UpdateOrganizationInput!): Boolean!
  updateDealCategories(input: [DealCategoryInput]!): Boolean!
  upsertInvestor(input: UpsertInvestorInput!): Investor
  invitationStatus(input: InvitationStatusInput!): String!
  inviteInvestor(input: InviteInvestorInput!): String!
  upsertCompany(input: UpsertCompanyInput!): Company
  upsertDeal(input: UpsertDealInput!): Deal
  sendInvitation(input: InviteInvestorInput!): Boolean!
  upsertTicket(input: UpsertTicketInput!): Ticket
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
      return context.Investor.signup(input);
    },
    investorLogin(root, { input }, context) {
      return context.Investor.login(input);
    },
    logout(root, params, context) {
      return authedMutation(() => true, false)(context.user);
    },
    forgotPassword(root, { input }, context) {
      return context.Investor.forgotPassword(input);
    },
    resetPassword(root, { input }, context) {
      return context.Investor.resetPassword(input);
    },
    changeEmail(root, { input }, context) {
      return authedMutation(context.Investor.changeEmail, false)(context.user, input);
    },
    changePassword(root, { input }, context) {
      return authedMutation(context.Investor.changePassword, false)(context.user, input);
    },
    adminLoginAck(root, variables, context) {
      return context.Admin.loginAck(context.user);
    },
    updateOrganization(root, { input }, context) {
      return adminMutation(context.Organization.update, false)(context.user, input);
    },
    updateDealCategories(root, { input }, context) {
      return adminMutation(context.Organization.updateDealCategories, false)(context.user, input);
    },
    upsertInvestor(root, { input }, context) {
      return authedMutation(context.Investor.upsert, null)(context.user, input);
    },
    invitationStatus(root, { input }, context) {
      return context.Investor.invitationStatus(input);
    },
    inviteInvestor(root, { input }, context) {
      return adminMutation(context.Admin.inviteInvestor, false)(context.user, input);
    },
    upsertCompany(root, { input }, context) {
      return adminMutation(context.Company.upsert, null)(context.user, input);
    },
    upsertDeal(root, { input }, context) {
      return adminMutation(context.Deal.upsert, null)(context.user, input);
    },
    sendInvitation(root, { input }, context) {
      return adminMutation(context.Admin.sendInvitation, false)(context.user, input);
    },
    upsertTicket(root, { input }, context) {
      return adminMutation(context.Ticket.upsert, null)(context.user, input);
    },
  },
};
