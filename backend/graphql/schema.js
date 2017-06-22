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

type Amount {
  amount: String!
  currency: String!
}

type Tickets {
  count: Int!
  sum: Amount
}

type InvestmentSettings {
  type: String!
  dealCategories: [String]!
  averageTicket: Amount!
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
  role: String!
  picture: File
  investmentSettings: InvestmentSettings
  individualSettings: IndividualSettings
  corporationSettings: CorporationSettings
  advisor: Advisor
  createdAt: Date!
}

type Investor {
  id: ID!
  fullName: String!
  email: String!
  tickets: Tickets!
  pictureUrl: String!
  companyName: String!
  createdAt: Date!
}

type GeneralSettings {
  name: String!
  website: String!
  description: String!
  emailDomains: [String]!
}

type OrganizationInvestmentSettings {
  dealCategories: [String]!
  defaultCurrency: String!
}

type InvitationEmail {
  subject: String!
  body: String!
}

type ParametersSettings {
  investment: OrganizationInvestmentSettings!
  invitationEmail: InvitationEmail!
}

type Organization {
  id: ID!
  shortId: ID!
  generalSettings: GeneralSettings!
  parametersSettings: ParametersSettings!
  domain: String
}

type Company {
  id: ID!
  name: String!
  website: String!
  description: String!
  domain: String!
}

type Deal {
  id: ID!
  company: Company!
  name: String!
  description: String!
  category: String!
  totalAmount: Amount!
  minTicket: Amount!
  maxTicket: Amount!
  carried: String!
  hurdle: String!
  deck: File!
  tickets: Tickets!
  createdAt: Date!
}

type Ticket {
  id: ID!
  investor: Investor!
  deal: Deal!
  amount: Amount!
  createdAt: Date!
}

type Query {
  organization(shortId: ID!): Organization
  me: User
  investors: [Investor]
  companies: [Company]
  deals: [Deal]
  tickets: [Ticket]
}

schema {
  query: Query
  mutation: Mutation
}
`;

const adminQuery = query => user => {
  if (!user) {
    return null;
  }
  if (user.role !== 'admin') {
    return null;
  }
  return query(user);
};

const resolvers = {
  Date: GraphQLDate,
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
    investors(root, params, context) {
      return adminQuery(context.Organization.investors)(context.user);
    },
    companies(root, params, context) {
      return adminQuery(context.Organization.companies)(context.user);
    },
    deals(root, params, context) {
      return adminQuery(context.Organization.deals)(context.user);
    },
    tickets(root, params, context) {
      return adminQuery(context.Organization.tickets)(context.user);
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: [mutationsSchema, schema],
  resolvers: Object.assign(mutationsResolvers, resolvers),
});

module.exports = executableSchema;
