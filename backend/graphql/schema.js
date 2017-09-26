const { makeExecutableSchema } = require('graphql-tools');
const GraphQLDate = require('graphql-date');
const GraphQLJSON = require('graphql-type-json');

const { schema: mutationsSchema, resolvers: mutationsResolvers } = require('./mutations');

const schema = `
scalar Date
scalar JSON

type Name {
  firstName: String!
  lastName: String!
}

type File {
  name: String!
  url: String!
  uploaded: Boolean!
}

type Address {
  address1: String!
  address2: String!
  city: String!
  zipCode: String!
  country: String!
  state: String!
}

type Amount {
  amount: String!
  currency: String!
}

type User {
  id: ID!
  shortId: ID!
  picture: [File]!
  fullName: String!
  name: Name!
  phone1: String!
  phone2: String!
  email: String!
  role: String!
  type: String
  status: String!
  createdAt: Date!
  updatedAt: Date!
}

type GeneralSettings {
  name: String!
  website: String!
  description: String!
  emailDomains: [String]!
}

type Email {
  subject: String!
  body: String!
}

type Organization {
  id: ID!
  shortId: ID!
  generalSettings: GeneralSettings!
  domain: String
}

type Invoice {
  id: ID!
  shortId: ID!
  customId: String!
  netAmount: Amount!
  grossAmount: Amount
  purchaseOrder: String
  status: String
  origin: String
  debtor: String
  name: String
  createdAt: Date!
  updatedAt: Date!
  creationDate: Date!
  dueDate: Date!
}

type Query {
  organization(shortId: ID!): Organization
  invoice(shortId: ID!): Invoice
  invoices: [Invoice]
  user: User
}

schema {
  query: Query
  mutation: Mutation
}
`;

const resolvers = {
  Date: GraphQLDate,
  JSON: GraphQLJSON,
  Query: {
    organization(root, { shortId }, context) {
      return context.Organization.organization(shortId);
    },
    user(root, params, context) {
      return context.User.user(context.user);
    },
    invoice(root, { shortId }, context) {
      return context.Invoice.invoice(shortId);
    },
    invoices(root, params, context) {
      return context.Invoice.invoices();
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: [mutationsSchema, schema],
  resolvers: Object.assign(mutationsResolvers, resolvers),
});

module.exports = executableSchema;
