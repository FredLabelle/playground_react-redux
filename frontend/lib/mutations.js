import { gql } from 'react-apollo';

export const investorSignupMutation = gql`
  mutation investorSignup($input: InvestorSignupInput!) {
    investorSignup(input: $input) {
      success
      token
    }
  }
`;

export const investorLoginMutation = gql`
  mutation investorLogin($input: InvestorLoginInput!) {
    investorLogin(input: $input) {
      success
      token
    }
  }
`;

export const logoutMutation = gql`
  mutation logout {
    logout
  }
`;

export const forgotPasswordMutation = gql`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;

export const resetPasswordMutation = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      token
    }
  }
`;

export const updateInvestorMutation = gql`
  mutation updateInvestor($input: UpdateInvestorInput!) {
    updateInvestor(input: $input)
  }
`;
