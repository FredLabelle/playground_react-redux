const DataLoader = require('dataloader');

const { Organization, InvestorProfile } = require('../models');

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
    try {
      const organization = await OrganizationService.findByShortId(shortId);
      return organization.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
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
  async investors(user) {
    try {
      const organization = await user.getOrganization();
      const investors = await organization.getUsers({
        where: { role: 'investor' },
        include: [{ model: InvestorProfile }],
      });
      return investors.map(investor =>
        Object.assign({}, investor.toJSON(), investor.InvestorProfile.toJSON())
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = OrganizationService;
