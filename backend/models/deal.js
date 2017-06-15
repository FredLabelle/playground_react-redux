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
  totalAmount: {
    type: Sequelize.JSONB,
  },
  minTicket: {
    type: Sequelize.JSONB,
  },
  maxTicket: {
    type: Sequelize.JSONB,
  },
  carried: {
    type: Sequelize.STRING,
  },
  deck: {
    type: Sequelize.JSONB,
    defaultValue: {
      name: '',
      url: '',
      image: false,
    },
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: '',
  },
});
