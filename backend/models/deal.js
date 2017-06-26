const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');

module.exports = sequelize.define(
  'Deal',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    shortId: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    deck: {
      type: Sequelize.JSONB,
      defaultValue: [],
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
    referenceClosingDate: {
      type: Sequelize.STRING,
    },
    carried: {
      type: Sequelize.STRING,
    },
    hurdle: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate(organization) {
        if (!organization.shortId) {
          const shortId = shortid.generate();
          Object.assign(organization, { shortId });
        }
      },
    },
  },
);
