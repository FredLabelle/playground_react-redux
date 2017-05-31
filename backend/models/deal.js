const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define('Deal', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
  },
});
