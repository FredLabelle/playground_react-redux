const Sequelize = require('sequelize');
const { parse } = require('url');
const shortid = require('shortid');

const sequelize = require('./sequelize');

const Organization = sequelize.define(
  'Organization',
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
      allowNull: false,
    },
    website: {
      type: Sequelize.STRING,
    },
    dealCategories: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['Seed', 'Serie A', 'Serie B', 'Later Stage'],
      allowNull: false,
    },
    invitationEmail: {
      type: Sequelize.JSONB,
    },
    investmentMechanism: {
      type: Sequelize.JSONB,
      defaultValue: {
        systematic: true,
        dealByDeal: true,
      },
      allowNull: false,
    },
    defaultCurrency: {
      type: Sequelize.STRING,
      defaultValue: 'usd',
      allowNull: false,
    },
  },
  {
    getterMethods: {
      domain() {
        const { hostname } = parse(this.website);
        return hostname;
      },
    },
    hooks: {
      beforeCreate(organization) {
        if (!organization.shortId) {
          const shortId = shortid.generate();
          Object.assign(organization, { shortId });
        }
      },
    },
  }
);

module.exports = Organization;
