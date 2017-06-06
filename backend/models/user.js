const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
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
      defaultValue: {
        name: '',
        url: '',
        image: false,
      },
      allowNull: false,
    },
  },
  {
    hooks: {
      async beforeCreate(user) {
        // generate password on user creation
        if (user.role === 'investor') {
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
  }
);
