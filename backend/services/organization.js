const DataLoader = require('dataloader');

const { Organization } = require('../models');

const loader = new DataLoader(shortIds =>
  Promise.all(
    shortIds.map(shortId =>
      Organization.findOne({
        where: { shortId },
      })
    )
  )
);

module.exports = {
  /* findById(id) {
    return loader.load(id);
  },*/
  findByShortId(shortId) {
    return loader.load(shortId);
  },
};
