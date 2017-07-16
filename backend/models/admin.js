const Sequelize = require('sequelize');
const shortid = require('shortid');

const sequelize = require('./sequelize');

module.exports = sequelize.define(
  'Admin',
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
      defaultValue: 'admin',
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
    email: {
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
      beforeCreate(admin) {
        // generate shortId on admin creation
        if (!admin.shortId) {
          const shortId = shortid.generate();
          Object.assign(admin, { shortId });
        }
      },
    },
  },
);
