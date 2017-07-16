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

export const investorQuery = gql`
  query {
    investor {
      id
      name {
        firstName
        lastName
      }
      phone
      email
      picture {
        name
        url
        image
        uploaded
      }
      role
      type
      investmentSettings
      individualSettings {
        birthdate
        nationality
        idDocuments {
          name
          url
          image
          uploaded
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
          image
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

export const adminQuery = gql`
  query {
    admin {
      id
      name {
        firstName
        lastName
      }
      email
      picture {
        name
        url
        image
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
      picture {
        url
      }
      fullName
      email
      phone
      name {
        firstName
        lastName
      }
      investmentSettings
      type
      individualSettings {
        birthdate
        nationality
        idDocuments {
          name
          url
          image
          uploaded
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
          image
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
  query {
    deals {
      id
      shortId
      company {
        name
        website
        description
        domain
      }
      category {
        name
      }
      name
      description
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
        fullName
        picture {
          url
        }
      }
      deal {
        company {
          name
          website
          description
          domain
        }
        category {
          name
        }
        name
        amountAllocatedToOrganization {
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
        name
        domain
      }
      category {
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
        image
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
        fullName
        picture {
          url
        }
        ticketsSum {
          count
        }
      }
      tickets {
        id
        investor {
          fullName
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
