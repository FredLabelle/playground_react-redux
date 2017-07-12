const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');

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
    name: {
      type: Sequelize.JSONB,
      defaultValue: {
        firstName: '',
        lastName: '',
      },
      allowNull: false,
    },
    phone: {
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
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    picture: {
      type: Sequelize.JSONB,
      defaultValue: [],
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
      async beforeCreate(user) {
        // generate shortId on user creation
        if (!user.shortId) {
          const shortId = shortid.generate();
          Object.assign(user, { shortId });
        }
      },
    },
  },
);
