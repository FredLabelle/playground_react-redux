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
        investment {
          dealCategories
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
        investmentMethods
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
      tickets {
        count
      }
      pictureUrl
      companyName
      status
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
      tickets {
        count
        sum {
          amount
          currency
        }
      }
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
