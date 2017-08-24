import PropTypes from 'prop-types';
import { Component } from 'react';
import { graphql } from 'react-apollo';
import { Modal, Header, Form, Button, Grid, Divider } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import pick from 'lodash/pick';

import { omitDeep, handleChange } from '../../lib/util';
import { ReportPropType } from '../../lib/prop-types';
// import { reportQuery, reportsQuery } from '../../lib/queries';
import { upsertDealMutation } from '../../lib/mutations';
import FilesField from '../fields/files-field';

const initialState = ({ report }) => ({
  report: {
    ...pick(report, [
      'id',
      'senderName',
      'senderEmail',
      'replyTo',
      'email',
      'attachments',
    ]),
    cc: report.cc.join(', '),
    bcc: report.bcc.join(', '),
  },
  loading: false,
});

class UpsertReportModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    report: ReportPropType.isRequired,
    upsertReport: PropTypes.func.isRequired,
  };
  state = initialState(this.props);
  componentWillReceiveProps(nextProps) {
    this.setState(initialState(nextProps));
  }
  onSubmit = async event => {
    event.preventDefault();
    const report = omitDeep(this.state.report, '__typename');
    this.setState({ loading: true });
    const { data: { upsertReport } } = await this.props.upsertReport(report);
    this.setState({ loading: false });
    if (upsertReport) {
      toastr.success('Success!', this.props.report.id ? 'Report updated.' : 'Report created.');
      this.onCancel();
    } else {
      toastr.error('Error!', 'Something went wrong.');
    }
  };
  onCancel = () => {
    this.setState(initialState(this.props));
    this.props.onClose();
  };
  handleChange = handleChange().bind(this);
  render() {
    const { report } = this.props;
    const borderRight = '1px solid rgba(34, 36, 38, .15)';
    const borderLeft = '1px solid rgba(255, 255, 255, .1)';
    return (
      <Modal open={this.props.open} onClose={this.onCancel} size="large">
        <Header icon="line chart" content={report.id ? 'Update report' : ' Create report'} />
        <Modal.Content>
          <Form id="upsert-report" onSubmit={this.onSubmit}>
            <Grid>
              <Grid.Column width={12} style={{ borderRight }}>
                <Form.Group>
                  <Form.Input
                    name="report.senderName"
                    value={this.state.report.senderName}
                    onChange={this.handleChange}
                    label="Email sender name"
                    placeholder="From name"
                    width={6}
                  />
                  <Form.Input
                    name="report.senderEmail"
                    value={this.state.report.senderEmail}
                    onChange={this.handleChange}
                    label="Email sender email"
                    placeholder="From email"
                    type="email"
                    width={5}
                  />
                  <Form.Input
                    name="report.replyTo"
                    value={this.state.report.replyTo}
                    onChange={this.handleChange}
                    label="Reply to"
                    placeholder="Reply to"
                    type="email"
                    width={5}
                  />
                </Form.Group>
                <Divider />
                <Form.Input
                  name="report.email.subject"
                  value={this.state.report.email.subject}
                  onChange={this.handleChange}
                  label="Subject"
                  placeholder="Subject"
                />
                <Form.TextArea
                  name="report.email.body"
                  value={this.state.report.email.body}
                  onChange={this.handleChange}
                  label="Body"
                  placeholder="Body"
                  autoHeight
                />
                <FilesField
                  name="report.attachments"
                  value={this.state.report.attachments}
                  onChange={this.handleChange}
                  label="Attachments"
                />
              </Grid.Column>
              <Grid.Column width={4} style={{ borderLeft }}>
                <Form.TextArea
                  name="report.cc"
                  value={this.state.report.cc}
                  onChange={this.handleChange}
                  label="Cc"
                  placeholder="Cc"
                  autoHeight
                />
                <Form.TextArea
                  name="report.bcc"
                  value={this.state.report.bcc}
                  onChange={this.handleChange}
                  label="Bcc"
                  placeholder="Bcc"
                  autoHeight
                />
              </Grid.Column>
            </Grid>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            color="red"
            content="Cancel"
            icon="remove"
            labelPosition="left"
            onClick={this.onCancel}
          />
          <Button
            type="submit"
            form="upsert-report"
            color="green"
            disabled={this.state.loading}
            loading={this.state.loading}
            content={report.id ? 'Update' : 'Create'}
            icon="save"
            labelPosition="left"
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default graphql(upsertDealMutation, {
  props: ({ mutate, /* ownProps: { report } */ }) => ({
    upsertReport: input =>
      mutate({
        variables: { input },
        /* refetchQueries: [
          report.id
            ? {
                query: reportQuery,
                variables: { shortId: report.shortId },
              }
            : { query: reportsQuery },
        ], */
      }),
  }),
})(UpsertReportModal);
