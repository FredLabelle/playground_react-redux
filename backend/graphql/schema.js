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

type TicketsSum {
  count: Int!
  sum: Amount
}

type IndividualSettings {
  birthdate: String!
  nationality: String!
  idDocuments: [File]!
  fiscalAddress: Address!
}

type CorporationSettings {
  position: String!
  companyName: String
  companyAddress: Address!
  incProof: [File]!
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
  picture: [File]
  type: String
  investmentSettings: JSON
  individualSettings: IndividualSettings
  corporationSettings: CorporationSettings
  advisor: Advisor
  createdAt: Date!
}

type Investor {
  id: ID!
  fullName: String!
  email: String!
  ticketsSum: TicketsSum!
  pictureUrl: String!
  companyName: String!
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

type OrganizationInvestmentMechanisms {
  optOutTime: String!
  defaultCurrency: String!
}

type InvitationEmail {
  subject: String!
  body: String!
}

type ParametersSettings {
  investmentMechanisms: OrganizationInvestmentMechanisms!
  invitationEmail: InvitationEmail!
}

type DealCategory {
  id: ID!
  name: String!
  investmentMechanisms: [String]!
}

type Organization {
  id: ID!
  shortId: ID!
  generalSettings: GeneralSettings!
  parametersSettings: ParametersSettings!
  domain: String
  dealCategories: [DealCategory]!
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
  shortId: ID!
  company: Company!
  category: DealCategory!
  name: String!
  description: String!
  totalAmount: Amount!
  minTicket: Amount!
  maxTicket: Amount!
  carried: String!
  hurdle: String!
  deck: [File]!
  ticketsSum: TicketsSum!
  investorsCommited: Int!
  investors: [Investor]
  tickets: [Ticket]
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
  deal(shortId: ID!): Deal
}

schema {
  query: Query
  mutation: Mutation
}
`;

const authedQuery = query => user => {
  if (!user) {
    return null;
  }
  return query(user);
};

const adminQuery = query => (user, params) => {
  if (!user) {
    return null;
  }
  if (user.role !== 'admin') {
    return null;
  }
  return query(user, params);
};

const resolvers = {
  Date: GraphQLDate,
  JSON: GraphQLJSON,
  Query: {
    organization(root, { shortId }, context) {
      return context.Organization.organization(shortId);
    },
    me(root, params, context) {
      return context.User.me(context.user);
    },
    investors(root, params, context) {
      return adminQuery(context.Organization.investors)(context.user);
    },
    companies(root, params, context) {
      return adminQuery(context.Organization.companies)(context.user);
    },
    deals(root, params, context) {
      return authedQuery(context.Organization.deals)(context.user);
    },
    tickets(root, params, context) {
      return authedQuery(context.Organization.tickets)(context.user);
    },
    deal(root, { shortId }, context) {
      return adminQuery(context.Deal.deal)(context.user, shortId);
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: [mutationsSchema, schema],
  resolvers: Object.assign(mutationsResolvers, resolvers),
});

module.exports = executableSchema;
