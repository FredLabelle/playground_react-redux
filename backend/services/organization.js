const DataLoader = require('dataloader');
const omit = require('lodash/omit');

const { Organization, DealCategory } = require('../models');

const OrganizationService = {
  shortIdLoader() {
    return new DataLoader(shortIds =>
      Promise.all(
        shortIds.map(shortId =>
          Organization.findOne({
            where: { shortId },
          }),
        ),
      ),
    );
  },
  findById(id) {
    return Organization.findById(id);
  },
  findByShortId(shortId) {
    return Organization.findOne({
      where: { shortId },
      include: [{ model: DealCategory }],
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
      const dealCategories = organization.DealCategories.map(dealCategory => dealCategory.toJSON());
      const orderSorter = ({ order: orderA }, { order: orderB }) => orderA - orderB;
      dealCategories.sort(orderSorter);
      return Object.assign({}, organization.toJSON(), { dealCategories });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async update(user, input) {
    try {
      const organization = await user.getOrganization();
      await organization.update(input);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async updateDealCategories(user, input) {
    try {
      const organization = await user.getOrganization();
      const dealCategories = await organization.getDealCategories();
      const promises = input.map((inputDealCategory, index) => {
        const dealCategory = dealCategories.find(category => category.id === inputDealCategory.id);
        const values = Object.assign({ order: index }, omit(inputDealCategory, 'id'));
        if (dealCategory) {
          return dealCategory.update(values);
        }
        return organization.createDealCategory(values);
      });
      const updatedDealCategories = await Promise.all(promises);
      const dealCategoriesIds = updatedDealCategories.map(dealCategory => dealCategory.id);
      await DealCategory.destroy({
        where: { id: { $notIn: dealCategoriesIds } },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

module.exports = OrganizationService;
