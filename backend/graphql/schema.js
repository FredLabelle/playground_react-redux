const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');

const schema = `

scalar JSON

type User {
  id: String!
  firstName: String!
  lastName: String!
  email: String!
  birthdate: String!
  nationality: String!
  address1: String!
  address2: String!
  city: String!
  zipCode: String!
  country: String!
  state: String!
  advisorFullName: String!
  advisorEmail: String!
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

input InvestorSignupInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
  dealCategories: [String]!
  averageTicket: Int!
  averageTicketCurrency: String!
  investmentMechanism: String!
  organizationShortId: String!
}

input InvestorLoginInput {
  email: String!
  password: String!
  organizationShortId: String!
}

type LoginResult {
  success: Boolean!
  token: String
}

input ForgotPasswordInput {
  email: String!
  organizationShortId: String!
}

input ResetPasswordInput {
  token: String!
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
  investorSignup(input: InvestorSignupInput!): LoginResult!
  investorLogin(input: InvestorLoginInput!): LoginResult!
  logout: Boolean!
  forgotPassword(input: ForgotPasswordInput!): Boolean!
  resetPassword(input: ResetPasswordInput!): LoginResult!
  updateInvestor(input: UpdateInvestorInput!): Boolean!
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
      return context.Organization.organization(shortId);
    },
    me(root, params, context) {
      if (!context.user) {
        return null;
      }
      return context.User.me(context.user);
    },
  },
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

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

module.exports = executableSchema;
