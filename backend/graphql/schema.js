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

type TicketsSum {
  count: Int!
  sum: Amount
}

type IndividualSettings {
  birthdate: String!
  nationality: String!
  idDocuments: [IdDocument]!
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

type Investor {
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
  investmentSettings: JSON
  individualSettings: IndividualSettings
  corporationSettings: CorporationSettings
  advisor: Advisor
  ticketsSum: TicketsSum!
  company: Company!
  status: String!
  deals: [Deal]
  tickets: [Ticket]
  createdAt: Date!
  updatedAt: Date!
}

type Admin {
  id: ID!
  shortId: ID!
  picture: [File]!
  fullName: String!
  name: Name!
  email: String!
  role: String!
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

type Email {
  subject: String!
  body: String!
}

type ParametersSettings {
  investmentMechanisms: OrganizationInvestmentMechanisms!
  invitationEmail: Email!
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
  spvName: String
  description: String
  roundSize: Amount!
  premoneyValuation: Amount!
  amountAllocatedToOrganization: Amount!
  minTicket: Amount!
  maxTicket: Amount!
  referenceClosingDate: String
  carried: String!
  hurdle: String!
  deck: [File]!
  ticketsSum: TicketsSum!
  investorsCommited: Int!
  investors: [Investor]
  tickets: [Ticket]
  reports: [Report]
  createdAt: Date!
}

type Ticket {
  id: ID!
  investor: Investor!
  deal: Deal!
  amount: Amount!
  status: String!
  createdAt: Date!
}

type Report {
  id: ID!
  senderName: String!
  senderEmail: String!
  replyTo: String!
  email: Email!
  attachments: [File]!
  cc: [String]!
  bcc: [String]!
}

type Query {
  organization(shortId: ID!): Organization
  investorUser: Investor
  adminUser: Admin
  investors: [Investor]
  companies: [Company]
  deals: [Deal]
  tickets: [Ticket]
  deal(shortId: ID!): Deal
  investor(shortId: ID!): Investor
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
    investorUser(root, params, context) {
      return context.Investor.investorUser(context.user);
    },
    adminUser(root, params, context) {
      return context.Admin.adminUser(context.user);
    },
    investors(root, params, context) {
      return adminQuery(context.Investor.investors)(context.user);
    },
    companies(root, params, context) {
      return adminQuery(context.Company.companies)(context.user);
    },
    deals(root, params, context) {
      return authedQuery(context.Deal.deals)(context.user);
    },
    tickets(root, params, context) {
      return authedQuery(context.Ticket.tickets)(context.user);
    },
    deal(root, { shortId }, context) {
      return adminQuery(context.Deal.deal)(context.user, shortId);
    },
    investor(root, { shortId }, context) {
      return adminQuery(context.Investor.investor)(context.user, shortId);
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: [mutationsSchema, schema],
  resolvers: Object.assign(mutationsResolvers, resolvers),
});

module.exports = executableSchema;
