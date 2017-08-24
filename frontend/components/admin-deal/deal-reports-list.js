import PropTypes from 'prop-types';
import { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';

import { ReportPropType } from '../../lib/prop-types';
import UpsertReportModal from '../common/upsert-report-modal';

const DealReportsListHeader = () =>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>;

class DealReportsListRow extends Component {
  static propTypes = { report: ReportPropType.isRequired };
  state = { upsertReportModalOpen: false };
  onUpsertReportModalClose = () => {
    this.setState({ upsertReportModalOpen: false });
  };
  updateReport = event => {
    event.preventDefault();
    this.setState({ upsertReportModalOpen: true });
  };
  render() {
    const { report } = this.props;
    return (
      <Table.Row>
        <Table.Cell>{report.subject}</Table.Cell>
        <Table.Cell>STATUS</Table.Cell>
        <Table.Cell style={{ textAlign: 'center' }}>
          <Button
            type="button"
            basic
            className="button-link"
            content="Edit"
            onClick={this.updateReport}
          />
          <UpsertReportModal
            open={this.state.upsertReportModalOpen}
            onClose={this.onUpsertReportModalClose}
            report={report}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

const DealReportsList = ({ reports }) =>
  reports.length
    ? <Table basic="very" celled>
        <DealReportsListHeader />
        <Table.Body>
          {reports.map(report => <DealReportsListRow key={report.id} report={report} />)}
        </Table.Body>
      </Table>
    : null;
DealReportsList.propTypes = { reports: PropTypes.arrayOf(ReportPropType).isRequired };

export default DealReportsList;
