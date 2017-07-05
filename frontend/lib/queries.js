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

export const meQuery = gql`
  query {
    me {
      id
      name {
        firstName
        lastName
      }
      email
      picture {
        url
        image
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

export const investorsQuery = gql`
  query {
    investors {
      id
      fullName
      email
      pictureUrl
      companyName
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
      totalAmount {
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
        pictureUrl
        companyName
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
        totalAmount {
          amount
          currency
        }
      }
      amount {
        amount
        currency
      }
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
      totalAmount {
        amount
        currency
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
        pictureUrl
        companyName
        ticketsSum {
          count
        }
      }
      tickets {
        id
        investor {
          fullName
          pictureUrl
          companyName
        }
        amount {
          amount
          currency
        }
      }
    }
  }
`;
