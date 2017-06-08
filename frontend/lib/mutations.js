import { gql } from 'react-apollo';

export const investorSignupMutation = gql`
  mutation investorSignup($input: InvestorSignupInput!) {
    investorSignup(input: $input)
  }
`;

export const investorLoginMutation = gql`
  mutation investorLogin($input: InvestorLoginInput!) {
    investorLogin(input: $input)
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
    resetPassword(input: $input)
  }
`;

export const updateInvestorMutation = gql`
  mutation updateInvestor($input: UpdateInvestorInput!) {
    updateInvestor(input: $input)
  }
`;

export const updateInvestorFileMutation = gql`
  mutation updateInvestorFile($input: UpdateInvestorFileInput!) {
    updateInvestorFile(input: $input)
  }
`;

export const adminLoginAckMutation = gql`
  mutation adminLoginAck {
    adminLoginAck
  }
`;

export const updateOrganizationMutation = gql`
  mutation updateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input)
  }
`;
