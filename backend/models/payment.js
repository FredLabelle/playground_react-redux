const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');
const { gravatarPicture } = require('../lib/util');

module.exports = sequelize.define(
  'Payment',
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
    amount: {
      type: Sequelize.JSONB,
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
    origin: {
      type: Sequelize.STRING,
      defaultValue: 'aircall',
    }
  },
  {
    hooks: {
      beforeCreate(payment) {
        // generate shortId on user creation
        if (!payment.shortId) {
          const shortId = shortid.generate();
          Object.assign(payment, { shortId });
        }
      },
    },
  },
);
