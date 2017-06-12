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
    parametersSettings: {
      type: Sequelize.JSONB,
      defaultValue: {
        investment: {
          dealCategories: ['Seed', 'Serie A', 'Serie B', 'Later Stage'],
          defaultCurrency: 'usd',
        },
        invitationEmail: {
          subject: "You've been invited to join {{organization}}!",
          body: [
            'Dear {{firstname}},',
            '',
            'Here is the link to signup to the club:',
            '{{url}}',
            '',
            'Best,',
          ].join('\n'),
        },
      },
      allowNull: false,
    },
  },
  {
    getterMethods: {
      domain() {
        const { hostname } = parse(this.generalSettings.website);
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
