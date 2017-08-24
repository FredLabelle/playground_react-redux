const omit = require('lodash/omit');

const { Report } = require('../models');
const { handleFilesUpdate } = require('../lib/util');

const ReportService = {
  findById(id) {
    return Report.findById(id);
  },
  async upsert(admin, input) {
    try {
      let report = await ReportService.findById(input.id);
      if (report && admin.organizationId !== report.organizationId) {
        return null;
      }
      if (!report) {
        const organization = await admin.getOrganization();
        report = await organization.createReport(omit(input, 'attachments'));
      }
      const attachments = await handleFilesUpdate(
        input.attachments,
        `reports/attachments/${report.shortId}`,
      );
      if (attachments) {
        Object.assign(input, { attachments });
      }
      const result = await report.update(input);
      return result.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = ReportService;
