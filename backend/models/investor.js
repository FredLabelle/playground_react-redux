const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');
const { gravatarPicture } = require('../lib/util');

module.exports = sequelize.define(
  'Investor',
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
    role: {
      type: Sequelize.STRING,
      defaultValue: 'investor',
      allowNull: false,
    },
    name: {
      type: Sequelize.JSONB,
      defaultValue: {
        firstName: '',
        lastName: '',
      },
      allowNull: false,
    },
    phone1: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    phone2: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
    },
    changeEmailToken: {
      type: Sequelize.STRING,
    },
    picture: {
      type: Sequelize.JSONB,
      defaultValue: [],
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'created',
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: 'individual',
    },
    investmentSettings: {
      type: Sequelize.JSONB,
      defaultValue: {},
      allowNull: false,
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
  },
  {
    getterMethods: {
      fullName() {
        return `${this.name.firstName} ${this.name.lastName}`;
      },
    },
    hooks: {
      beforeCreate(investor) {
        // generate shortId on investor creation
        if (!investor.shortId) {
          const shortId = shortid.generate();
          Object.assign(investor, { shortId });
        }
        // generate picture
        Object.assign(investor, { picture: [gravatarPicture(investor.email)] });
      },
    },
  },
);

/*

phone migration

ALTER TABLE "Investors" RENAME COLUMN "phone" TO "phone1";
ALTER TABLE "Investors" ADD COLUMN "phone2" VARCHAR(255) DEFAULT '';

*/
