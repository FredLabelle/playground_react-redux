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
    generalSettings: {
      type: Sequelize.JSONB,
      defaultValue: {
        name: '',
        website: '',
        description: '',
        emailDomains: [],
      },
      allowNull: false,
    },
  },
  {
    getterMethods: {
      domain() {
        return parse(this.generalSettings.website).hostname;
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
  },
);

module.exports = Organization;
