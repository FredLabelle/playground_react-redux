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

export const updateDealCategoriesMutation = gql`
  mutation updateDealCategories($input: [DealCategoryInput]!) {
    updateDealCategories(input: $input)
  }
`;

export const upsertInvestorMutation = gql`
  mutation upsertInvestor($input: UpsertInvestorInput!) {
    upsertInvestor(input: $input) {
      id
    }
  }
`;

export const invitationStatusMutation = gql`
  mutation invitationStatus($input: InvitationStatusInput!) {
    invitationStatus(input: $input)
  }
`;

export const inviteInvestorMutation = gql`
  mutation inviteInvestor($input: InviteInvestorInput!) {
    inviteInvestor(input: $input)
  }
`;

export const upsertCompanyMutation = gql`
  mutation upsertCompany($input: UpsertCompanyInput!) {
    upsertCompany(input: $input) {
      id
      name
      website
      description
      domain
    }
  }
`;

export const upsertTicketMutation = gql`
  mutation upsertTicket($input: UpsertTicketInput!) {
    upsertTicket(input: $input) {
      id
    }
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

export const upsertDealMutation = gql`
  mutation upsertDeal($input: UpsertDealInput!) {
    upsertDeal(input: $input) {
      id
    }
  }
`;

export const sendInvitationMutation = gql`
  mutation sendInvitation($input: InviteInvestorInput!) {
    sendInvitation(input: $input)
  }
`;
