import { gql } from 'react-apollo';

export const organizationQuery = gql`
  query organization($shortId: ID!) {
    organization(shortId: $shortId) {
      id
      shortId
      generalSettings {
        name
        website
        description
        emailDomains
      }
      parametersSettings {
        investmentMechanisms {
          optOutTime
          defaultCurrency
        }
        invitationEmail {
          subject
          body
        }
      }
      domain
      dealCategories {
        id
        name
        investmentMechanisms
      }
    }
  }
`;

export const investorUserQuery = gql`
  query {
    investorUser {
      id
      name {
        firstName
        lastName
      }
      phone1
      phone2
      email
      picture {
        name
        url
        uploaded
      }
      role
      type
      investmentSettings
      individualSettings {
        birthdate
        nationality
        idDocuments {
          id
          type
          number
          files {
            name
            url
            uploaded
          }
          expirationDate
        }
        fiscalAddress {
          address1
          address2
          city
          zipCode
          country
          state
        }
      }
      corporationSettings {
        position
        companyName
        companyAddress {
          address1
          address2
          city
          zipCode
          country
          state
        }
        incProof {
          name
          url
          uploaded
        }
      }
      advisor {
        name {
          firstName
          lastName
        }
        email
      }
    }
  }
`;

export const adminUserQuery = gql`
  query {
    adminUser {
      id
      name {
        firstName
        lastName
      }
      email
      picture {
        name
        url
        uploaded
      }
      role
    }
  }
`;

export const investorsQuery = gql`
  query {
    investors {
      id
      shortId
      picture {
        url
      }
      fullName
      email
      status
      ticketsSum {
        count
      }
      createdAt
      updatedAt
    }
  }
`;

export const companiesQuery = gql`
  query {
    companies {
      id
      name
      website
      description
      domain
    }
  }
`;

export const dealsQuery = gql`
  query deals {
    deals {
      id
      shortId
      company {
        id
        name
        website
        description
        domain
      }
      category {
        id
        name
      }
      name
      description
      amountAllocatedToOrganization {
        amount
        currency
      }
      roundSize {
        amount
        currency
      }
      minTicket {
        amount
        currency
      }
      maxTicket {
        amount
        currency
      }
      carried
      deck {
        url
      }
      ticketsSum {
        count
        sum {
          amount
          currency
        }
      }
      investorsCommited
      createdAt
    }
  }
`;

export const ticketsQuery = gql`
  query {
    tickets {
      id
      investor {
        id
        fullName
        email
        picture {
          url
        }
      }
      deal {
        id
        company {
          id
          name
          website
          description
          domain
        }
        category {
          id
          name
        }
        name
        amountAllocatedToOrganization {
          amount
          currency
        }
        roundSize {
          amount
          currency
        }
      }
      amount {
        amount
        currency
      }
      status
      createdAt
    }
  }
`;

export const dealQuery = gql`
  query deal($shortId: ID!) {
    deal(shortId: $shortId) {
      id
      shortId
      company {
        id
        name
        domain
      }
      category {
        id
        name
      }
      name
      spvName
      roundSize {
        amount
        currency
      }
      premoneyValuation {
        amount
        currency
      }
      amountAllocatedToOrganization {
        amount
        currency
      }
      minTicket {
        amount
        currency
      }
      maxTicket {
        amount
        currency
      }
      referenceClosingDate
      carried
      hurdle
      deck {
        name
        url
        uploaded
      }
      ticketsSum {
        count
        sum {
          amount
          currency
        }
      }
      investors {
        id
        shortId
        fullName
        email
        picture {
          url
        }
        ticketsSum {
          count
        }
      }
      tickets {
        id
        deal {
          id
          shortId
        }
        investor {
          id
          fullName
          email
          picture {
            url
          }
        }
        amount {
          amount
          currency
        }
      }
    }
  }
`;

export const investorQuery = gql`
  query investor($shortId: ID!) {
    investor(shortId: $shortId) {
      id
      shortId
      name {
        firstName
        lastName
      }
      fullName
      phone1
      phone2
      email
      picture {
        name
        url
        uploaded
      }
      role
      type
      investmentSettings
      individualSettings {
        birthdate
        nationality
        idDocuments {
          id
          type
          number
          files {
            name
            url
            uploaded
          }
          expirationDate
        }
        fiscalAddress {
          address1
          address2
          city
          zipCode
          country
          state
        }
      }
      corporationSettings {
        position
        companyName
        companyAddress {
          address1
          address2
          city
          zipCode
          country
          state
        }
        incProof {
          name
          url
          uploaded
        }
      }
      advisor {
        name {
          firstName
          lastName
        }
        email
      }
      status
      deals {
        id
        shortId
        name
        amountAllocatedToOrganization {
          amount
          currency
        }
        roundSize {
          amount
          currency
        }
        category {
          id
          name
        }
        company {
          id
          name
          domain
        }
      }
      ticketsSum {
        count
      }
      tickets {
        id
        deal {
          id
          name
          amountAllocatedToOrganization {
            amount
            currency
          }
          roundSize {
            amount
            currency
          }
          category {
            id
            name
          }
          company {
            id
            name
            domain
          }
        }
        investor {
          id
          shortId
        }
        amount {
          amount
          currency
        }
        createdAt
      }
    }
  }
`;
