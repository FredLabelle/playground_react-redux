const { parse } = require('url');
const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

/* class Company extends Sequelize.Model {
  get domain() {
    const { hostname } = parse(this.website);
    return hostname;
  }
}

Company.init({
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  website: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
}, { sequelize });

module.exports = Company;*/

module.exports = sequelize.define(
  'Company',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    website: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING,
    },
  },
  {
    getterMethods: {
      domain() {
        return parse(this.website).hostname;
      },
    },
  }
);
