const { Company } = require('../models');

const CompanyService = {
  async companies(user) {
    try {
      const organization = await user.getOrganization();
      const companies = await organization.getCompanies();
      return companies.map(company => company.toJSON());
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async upsert(user, input) {
    try {
      const organization = await user.getOrganization();
      const company = await Company.findOne({
        where: { name: input.name },
      });
      const result = company
        ? await company.update(input)
        : await organization.createCompany(input);
      return result.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = CompanyService;
