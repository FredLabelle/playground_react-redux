const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define('InvestorProfile', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'invited',
  },
  investmentSettings: {
    type: Sequelize.JSONB,
  },
  individualSettings: {
    type: Sequelize.JSONB,
    defaultValue: {
      birthdate: '01-01-1970',
      nationality: '',
      idDocuments: [],
      fiscalAddress: {
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        country: '',
        state: '',
      },
    },
    allowNull: false,
  },
  corporationSettings: {
    type: Sequelize.JSONB,
    defaultValue: {
      position: '',
      companyName: '',
      companyAddress: {
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        country: '',
        state: '',
      },
      incProof: [],
    },
  },
  advisor: {
    type: Sequelize.JSONB,
    defaultValue: {
      name: {
        firstName: '',
        lastName: '',
      },
      email: '',
    },
    allowNull: false,
  },
});
