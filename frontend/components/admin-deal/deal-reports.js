import { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react';

import { DealPropType } from '../../lib/prop-types';
import DealReportsList from './deal-reports-list';
import UpsertReportModal from '../common/upsert-report-modal';

class DealReports extends Component {
  static propTypes = { deal: DealPropType.isRequired };
  state = { upsertReportModalOpen: false };
  onUpsertReportModalClose = () => {
    this.setState({ upsertReportModalOpen: false });
  };
  createReport = event => {
    event.preventDefault();
    this.setState({ upsertReportModalOpen: true });
  };
  render() {
    const { deal } = this.props;
    const reportsPlural = deal.reports.length === 1 ? '' : 's';
    return (
      <Segment>
        <Button
          type="button"
          primary
          floated="right"
          content="Add new report"
          icon="line chart"
          labelPosition="left"
          onClick={this.createReport}
        />
        <h3>
          {deal.reports.length} report{reportsPlural}
        </h3>
        <DealReportsList reports={deal.reports} />
        <UpsertReportModal
          open={this.state.upsertReportModalOpen}
          onClose={this.onUpsertReportModalClose}
          report={{
            senderName: '',
            senderEmail: '',
            replyTo: '',
            email: { subject: '', body: '' },
            attachments: [],
            cc: [],
            bcc: [],
          }}
        />
      </Segment>
    );
  }
}

export default DealReports;
