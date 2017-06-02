const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');

const { schema: mutationsSchema, resolvers: mutationsResolvers } = require('./mutations');

const schema = `
scalar JSON

type User {
  id: ID!
  shortId: ID!
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
  id: ID!
  shortId: ID!
  name: String!
  website: String!
  domain: String!
  dealCategories: [String]!
  invitationEmail: JSON!
  investmentMechanism: JSON!
  defaultCurrency: String!
}

type Query {
  organization(shortId: ID!): Organization
  me: User
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
};

const executableSchema = makeExecutableSchema({
  typeDefs: [mutationsSchema, schema],
  resolvers: Object.assign(mutationsResolvers, resolvers),
});

module.exports = executableSchema;
