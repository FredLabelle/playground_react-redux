const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define('Ticket', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  amount: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
});
