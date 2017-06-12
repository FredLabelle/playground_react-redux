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
    }
  }
`;

export const meQuery = gql`
  query {
    me {
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
      investmentSettings {
        type
        dealCategories
        averageTicket {
          amount
          currency
        }
        mechanism
      }
      individualSettings {
        birthdate
        nationality
        idDocument {
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
      fullName
      picture {
        url
      }
      corporationSettings {
        companyName
      }
      createdAt
      email
    }
  }
`;
