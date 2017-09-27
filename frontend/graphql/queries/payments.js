import { gql } from 'react-apollo';

export default gql`
  query paymentsQuery {
    payments {
      id
      shortId
      amount {
        amount
        currency
      }
      description
      origin
      status
      createdAt
      updatedAt
    }
  }
`;
