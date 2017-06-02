import { gql } from 'react-apollo';

export const organizationQuery = gql`
  query organization($shortId: String!) {
    organization(shortId: $shortId) {
      name
      domain
      dealCategories
      defaultCurrency
    }
  }
`;

export const meQuery = gql`
  query {
    me {
      firstName
      lastName
      email
      birthdate
      nationality
      address1
      address2
      city
      zipCode
      country
      state
      advisorFullName
      advisorEmail
    }
  }
`;
