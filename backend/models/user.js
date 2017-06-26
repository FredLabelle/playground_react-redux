const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
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
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
        // generate password on user creation
        if (user.role === 'investor' && user.password) {
          const password = await bcrypt.hash(user.password, 10);
          Object.assign(user, { password });
        }
        // generate shortId on user creation
        if (!user.shortId) {
          const shortId = shortid.generate();
          Object.assign(user, { shortId });
        }
      },
    },
  },
);
