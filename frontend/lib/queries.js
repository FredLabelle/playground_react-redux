import { gql } from 'react-apollo';

export const organization = gql`
  query organization($shortId: String!) {
    organization(shortId: $shortId) {
      name
      domain
      dealCategories
      defaultCurrency
    }
  }
`;

export const me = gql`
  query {
    me {
      firstName
      lastName
    }
  }
`;
