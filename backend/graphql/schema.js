const { makeExecutableSchema } = require('graphql-tools');
const GraphQLJSON = require('graphql-type-json');

const { schema: mutationsSchema, resolvers: mutationsResolvers } = require('./mutations');

const schema = `
scalar JSON

type Name {
  firstName: String!
  lastName: String!
}

type File {
  name: String!
  url: String!
  image: Boolean!
}

type Address {
  address1: String!
  address2: String!
  city: String!
  zipCode: String!
  country: String!
  state: String!
}

type AverageTicket {
  amount: String!
  currency: String!
}

type InvestmentSettings {
  dealCategories: [String]!
  averageTicket: AverageTicket!
  mechanism: String!
}

type IndividualSettings {
  birthdate: String!
  nationality: String!
  idDocument: File!
  fiscalAddress: Address!
}

type CorporationSettings {
  position: String!
  companyName: String
  companyAddress: Address!
  incProof: File!
}

type Advisor {
  name: Name!
  email: String!
}

type User {
  id: ID!
  shortId: ID!
  name: Name!
  email: String!
  investmentSettings: InvestmentSettings!
  type: String!
  individualSettings: IndividualSettings!
  corporationSettings: CorporationSettings!
  advisor: Advisor!
}

type OrganizationInvestmentSettings {
  dealCategories: [String]!
  defaultCurrency: String!
}

type Email {
  subject: String!
  body: String!
}

type Organization {
  id: ID!
  shortId: ID!
  name: String!
  website: String!
  domain: String!
  investmentSettings: OrganizationInvestmentSettings!
  invitationEmail: Email!
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
