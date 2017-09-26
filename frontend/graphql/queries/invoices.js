import { gql } from 'react-apollo';

export default gql`
  query invoicesQuery {
    invoices {
      id
      shortId
      customId
      netAmount {
        amount
        currency
      }
      grossAmount {
        amount
        currency
      }
      purchaseOrder
      status
      origin
      debtor
      createdAt
      updatedAt
      name
    }
  }
`;
