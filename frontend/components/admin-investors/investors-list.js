import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Table, Button } from 'semantic-ui-react';
import Link from 'next/link';
import moment from 'moment';

import { linkHref, linkAs } from '../../lib/url';
import { RouterPropType, OrganizationPropType, InvestorPropType } from '../../lib/prop-types';
import { organizationQuery, investorsQuery } from '../../lib/queries';
import InvestorCell from '../common/investor-cell';
import TicketsSumCell from '../common/tickets-sum-cell';
import SendInvitationModal from './send-invitation-modal';
import UpsertInvestorModal from '../common/upsert-investor-modal';

const InvestorsListHeader = ({ router }) =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Investors</Table.HeaderCell>
      <Table.HeaderCell>Tickets</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      {router.admin && <Table.HeaderCell />}
      {/* <Table.HeaderCell>Actions</Table.HeaderCell> */}
    </Table.Row>
  </Table.Header>;
InvestorsListHeader.propTypes = { router: RouterPropType.isRequired };

class InvestorsListRow extends Component {
  static propTypes = {
    router: RouterPropType.isRequired,
    organization: OrganizationPropType.isRequired,
    investor: InvestorPropType.isRequired,
  };
  state = { sendInvitationModalOpen: false, upsertInvestorModalOpen: false };
  onSendInvitationModalClose = () => {
    this.setState({ sendInvitationModalOpen: false });
  };
  onUpsertInvestorModalClose = () => {
    this.setState({ upsertInvestorModalOpen: false });
  };
  sendInvitation = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ sendInvitationModalOpen: true });
  };
  updateInvestor = event => {
    event.preventDefault();
    this.setState({ upsertInvestorModalOpen: true });
  };
  render() {
    const { router, organization, investor } = this.props;
    const resend = investor.status === 'invited' ? 'Resend' : '';
    const action = investor.status === 'created' ? 'Send' : resend;
    const { shortId } = investor;
    const options = { ...router, shortId };
    return (
      <Link
        prefetch
        href={linkHref('/investors/investor', options)}
        as={linkAs('/investors', options)}
      >
        <Table.Row className="table-row">
          <InvestorCell investor={investor} />
          <TicketsSumCell ticketsSum={investor.ticketsSum} />
          <Table.Cell>
            <strong className={investor.status}>
              {investor.status}
            </strong>
            <br />
            {moment(investor.createdAt).format('DD/MM/YYYY')}
          </Table.Cell>
          {router.admin &&
            <Table.Cell>
              {investor.status !== 'joined' &&
                <Button
                  type="button"
                  basic
                  content={`${action} invitation`}
                  icon="mail"
                  labelPosition="left"
                  onClick={this.sendInvitation}
                />}
            </Table.Cell>}
          {/* <Table.Cell>
            <Button
              type="button"
              basic
              className="button-link"
              content="Edit"
              onClick={this.updateInvestor}
            />
            {' | '}
            <a href={`mailto:${investor.email}`}>Contact</a>
          </Table.Cell> */}
          <SendInvitationModal
            open={this.state.sendInvitationModalOpen}
            onClose={this.onSendInvitationModalClose}
            investor={investor}
            organization={organization}
          />
          <UpsertInvestorModal
            open={this.state.upsertInvestorModalOpen}
            onClose={this.onUpsertInvestorModalClose}
            investor={investor}
            organization={organization}
          />
          <style jsx>{`
            strong.created {
              color: #db2828;
            }
            strong.invited {
              color: #f2711c;
            }
            strong.joined {
              color: #21ba45;
            }
            strong {
              text-transform: capitalize;
            }
          `}</style>
        </Table.Row>
      </Link>
    );
  }
}

const InvestorsList = ({ router, organization, investors }) =>
  organization && investors.length
    ? <Table basic="very" celled>
        <InvestorsListHeader router={router} />
        <Table.Body>
          {investors.map(investor =>
            <InvestorsListRow
              key={investor.id}
              router={router}
              organization={organization}
              investor={investor}
            />,
          )}
        </Table.Body>
      </Table>
    : null;
InvestorsList.propTypes = {
  router: RouterPropType.isRequired,
  organization: OrganizationPropType,
  investors: PropTypes.arrayOf(InvestorPropType).isRequired,
};
InvestorsList.defaultProps = { organization: null };

export default compose(
  connect(({ router }) => ({ router })),
  graphql(organizationQuery, {
    options: ({ router }) => ({
      variables: { shortId: router.organizationShortId },
    }),
    props: ({ data: { organization } }) => ({ organization }),
  }),
  graphql(investorsQuery, {
    props: ({ data: { investors } }) => ({ investors: investors || [] }),
  }),
)(InvestorsList);
