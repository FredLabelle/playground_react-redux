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
    }
  }
`;
