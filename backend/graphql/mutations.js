exports.schema = `
input NameInput {
  firstName: String!
  lastName: String!
}

input AmountInput {
  amount: String!
  currency: String!
}

input FileInput {
  name: String!
  url: String!
  uploaded: Boolean!
}

input IdDocumentInput {
  id: ID!
  type: String!
  number: String!
  files: [FileInput]!
  expirationDate: String!
}

input SignupInput {
  name: NameInput!
  email: String!
  password: String!
  token: ID!
}

input LoginInput {
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
  idDocuments: [IdDocumentInput]!
  fiscalAddress: AddressInput!
}

input EmailInput {
  subject: String!
  body: String!
}

input UpsertUserInput {
  id: ID
  email: String
  phone1: String
  phone2: String
  name: NameInput
  picture: [FileInput]
  type: String
  individualSettings: IndividualSettingsInput
}

input UserInfoInput {
  name: NameInput
  email: String!
}

input ChangeEmailInput {
  password: String!
  email: String!
}

input ChangePasswordInput {
  currentPassword: String!
  password: String!
}

input GeneralSettingsInput {
  name: String!
  website: String!
  description: String!
  emailDomains: [String]!
}

input UpdateOrganizationInput {
  generalSettings: GeneralSettingsInput
}


type Mutation {
  signup(input: SignupInput!): ID
  login(input: LoginInput!): ID
  logout: Boolean!
  updateOrganization(input: UpdateOrganizationInput!): Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): ID
  changeEmail(input: ChangeEmailInput!): Boolean!
  changePassword(input: ChangePasswordInput!): Boolean!
  upsertUser(input: UpsertUserInput!): User
}
`;

const authedMutation = (mutation, errorValue) => (user, input) => {
  if (!user) {
    return errorValue;
  }
  return mutation(user, input);
};

exports.resolvers = {
  Mutation: {
    signup(root, { input }, context) {
      return context.User.signup(input);
    },
    login(root, { input }, context) {
      return context.User.login(input);
    },
    logout(root, params, context) {
      return authedMutation(() => true, false)(context.user);
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
    updateOrganization(root, { input }, context) {
      return context.Organization.update(input);
    },
    upsertUser(root, { input }, context) {
      return authedMutation(context.User.upsert, null)(context.user, input);
    },
  },
};
