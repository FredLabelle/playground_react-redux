const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');

const Payment = sequelize.define(
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
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'unmatched',
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

module.exports = Payment;
