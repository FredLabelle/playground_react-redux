import { gql } from 'react-apollo';

export const organizationQuery = gql`
  query organization($shortId: ID!) {
    organization(shortId: $shortId) {
      id
      shortId
      name
      domain
      investmentSettings {
        dealCategories
        defaultCurrency
      }
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
      investmentSettings {
        dealCategories
        averageTicket {
          amount
          currency
        }
        mechanism
      }
      type
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
