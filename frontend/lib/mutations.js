import { gql } from 'react-apollo';

export const signupMutation = gql`
  mutation signup($input: SignupInput!) {
    signup(input: $input)
  }
`;

export const loginMutation = gql`
  mutation login($input: LoginInput!) {
    login(input: $input)
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

export const updateOrganizationMutation = gql`
  mutation updateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input)
  }
`;

export const changeEmailMutation = gql`
  mutation changeEmail($input: ChangeEmailInput!) {
    changeEmail(input: $input)
  }
`;

export const changePasswordMutation = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;
