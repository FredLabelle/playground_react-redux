const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');
const { gravatarPicture } = require('../lib/util');

module.exports = sequelize.define(
  'Invoice',
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
    customId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    netAmount: {
      type: Sequelize.DOUBLE,
      unique: true,
      allowNull: false,
    },
    grossAmount: {
      type: Sequelize.DOUBLE,
    },
    purchaseOrder: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
    },
    origin: {
      type: Sequelize.STRING,
      defaultValue: 'pdf_parsed',
    },
    debtor: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
  },
  {
    hooks: {
      beforeCreate(invoice) {
        // generate shortId on user creation
        if (!invoice.shortId) {
          const shortId = shortid.generate();
          Object.assign(invoice, { shortId });
        }
      },
    },
  },
);
