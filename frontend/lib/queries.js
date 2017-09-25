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
      domain
    }
  }
`;

export const userQuery = gql`
  query {
    user {
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
