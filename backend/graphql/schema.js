const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');

const schema = `

scalar JSON

type User {
  id: String!
  firstName: String!
  lastName: String!
  email: String!
}

type Email {
  subject: String!
  body: String!
}

type InvestmentMechanism {
  systematic: Boolean
  dealByDeal: Boolean
}

type Organization {
  id: String!
  name: String!
  shortId: String!
  website: String!
  domain: String!
  dealCategories: [String]!
  invitationEmail: JSON!
  investmentMechanism: JSON!
  defaultCurrency: String!
}

type Query {
  organization(shortId: String!): Organization
  me: User
}

input InvestorSignupPayload {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  dealCategories: JSON!
  averageTicket: Int!
  averageTicketCurrency: String!
  investmentMechanism: String!
}

input ForgotPasswordPayload {
  email: String!
  organizationShortId: String!
}

input ResetPasswordPayload {
  token: String!
  password: String!
}

type Mutation {
  investorSignup(investor: InvestorSignupPayload!): User
  forgotPassword(payload: ForgotPasswordPayload!): Boolean
  resetPassword(payload: ResetPasswordPayload!): Boolean
}

schema {
  query: Query
  mutation: Mutation
}

`;

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    organization(root, { shortId }, context) {
      return context.Organization.findByShortId(shortId);
    },
    me(root, params, context) {
      return context.user;
    },
  },
  Mutation: {
    investorSignup(root, { investor }, context) {
      return context.User.signup(investor);
    },
    forgotPassword(root, { payload }, context) {
      return context.User.forgotPassword(payload);
    },
    resetPassword(root, { payload }, context) {
      return context.User.resetPassword(payload);
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

module.exports = executableSchema;
