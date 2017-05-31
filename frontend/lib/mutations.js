import { gql } from 'react-apollo';

export const forgotPasswordMutation = gql`
  mutation forgotPassword($payload: ForgotPasswordPayload!) {
    forgotPassword(payload: $payload)
  }
`;

export const resetPasswordMutation = gql`
  mutation resetPassword($payload: ResetPasswordPayload!) {
    resetPassword(payload: $payload)
  }
`;
