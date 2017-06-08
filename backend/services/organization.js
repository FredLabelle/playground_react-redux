const DataLoader = require('dataloader');

const { Organization } = require('../models');

const OrganizationService = {
  shortIdLoader() {
    return new DataLoader(shortIds =>
      Promise.all(
        shortIds.map(shortId =>
          Organization.findOne({
            where: { shortId },
          })
        )
      )
    );
  },
  findById(id) {
    return Organization.findById(id);
  },
  findByShortId(shortId) {
    return Organization.findOne({
      where: { shortId },
    });
  },
  findByEmailDomain(emailDomain) {
    return Organization.findOne({
      where: {
        generalSettings: {
          $contains: { emailDomains: [emailDomain] },
        },
      },
    });
  },
  async organization(shortId) {
    const organization = await OrganizationService.findByShortId(shortId);
    return organization.toJSON();
  },
  async update(user, input) {
    try {
      if (user.role !== 'admin') {
        return false;
      }
      const organization = await user.getOrganization();
      await organization.update(input);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = OrganizationService;
