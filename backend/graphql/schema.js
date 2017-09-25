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

type IdDocument {
  id: ID!
  type: String!
  number: String!
  files: [File]!
  expirationDate: String!
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

type IndividualSettings {
  birthdate: String!
  nationality: String!
  idDocuments: [IdDocument]!
  fiscalAddress: Address!
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
  picture: [File]
  type: String
  individualSettings: IndividualSettings
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

type Query {
  organization(shortId: ID!): Organization
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
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: [mutationsSchema, schema],
  resolvers: Object.assign(mutationsResolvers, resolvers),
});

module.exports = executableSchema;
