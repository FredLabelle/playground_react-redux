const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define('Company', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
  },
  website: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
});
