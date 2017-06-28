const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define('DealCategory', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  investmentMethods: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: ['DealByDeal', 'SystematicWithOptOut'],
    allowNull: false,
  },
});
