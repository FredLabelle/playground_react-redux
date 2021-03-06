const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');
const { gravatarPicture } = require('../lib/util');

module.exports = sequelize.define(
  'User',
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
      defaultValue: 'accountManager',
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
  },
  {
    getterMethods: {
      fullName() {
        return `${this.name.firstName} ${this.name.lastName}`;
      },
    },
    hooks: {
      beforeCreate(user) {
        // generate shortId on user creation
        if (!user.shortId) {
          const shortId = shortid.generate();
          Object.assign(user, { shortId });
        }
        // generate picture
        Object.assign(user, { picture: [gravatarPicture(user.email)] });
      },
    },
  },
);

/*

phone migration

ALTER TABLE "Users" RENAME COLUMN "phone" TO "phone1";
ALTER TABLE "Users" ADD COLUMN "phone2" VARCHAR(255) DEFAULT '';

*/
