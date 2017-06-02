exports.schema = `
input InvestorSignupInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  dealCategories: [String]!
  averageTicket: Int!
  averageTicketCurrency: String!
  investmentMechanism: String!
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

input UpdateInvestorInput {
  firstName: String
  lastName: String
  birthdate: String
  nationality: String
  address1: String
  address2: String
  city: String
  zipCode: String
  country: String
  state: String
  advisorFullName: String
  advisorEmail: String
}

type Mutation {
  investorSignup(input: InvestorSignupInput!): ID
  investorLogin(input: InvestorLoginInput!): ID
  logout: Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): ID
  updateInvestor(input: UpdateInvestorInput!): Boolean!
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
  },
};
