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
    defaultValue: [],
    allowNull: false,
  },
  averageTicket: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  averageTicketCurrency: {
    type: Sequelize.STRING,
    defaultValue: 'usd',
    allowNull: false,
  },
  investmentMechanism: {
    type: Sequelize.STRING,
    defaultValue: 'dealByDeal',
    allowNull: false,
  },
  birthdate: {
    type: Sequelize.STRING,
    defaultValue: '01-01-1970',
    allowNull: false,
  },
  nationality: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  idDocument: {
    type: Sequelize.STRING(1023),
    defaultValue: '',
    allowNull: false,
  },
  address1: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  address2: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  zipCode: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  country: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  advisorFullName: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
  advisorEmail: {
    type: Sequelize.STRING,
    defaultValue: '',
    allowNull: false,
  },
});
