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
      let company = await Company.findById(input.id);
      if (!company) {
        const organization = await user.getOrganization();
        company = await organization.createCompany(input);
      }
      const result = await company.update(input);
      return result.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = CompanyService;
