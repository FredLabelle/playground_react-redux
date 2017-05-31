const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define('InvestorProfile', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  dealCategories: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: false,
  },
  averageTicket: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  averageTicketCurrency: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  investmentMechanism: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
