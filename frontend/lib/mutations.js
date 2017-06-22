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

export const createInvestorMutation = gql`
  mutation createInvestor($input: CreateInvestorInput!) {
    createInvestor(input: $input)
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

export const createDealMutation = gql`
  mutation createDeal($input: CreateDealInput!) {
    createDeal(input: $input)
  }
`;

export const createTicketMutation = gql`
  mutation createTicket($input: CreateTicketInput!) {
    createTicket(input: $input)
  }
`;

export const changeEmailMutation = gql`
  mutation changeEmail($input: String!) {
    changeEmail(input: $input)
  }
`;
