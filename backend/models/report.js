const Sequelize = require('sequelize');

const sequelize = require('./sequelize');

module.exports = sequelize.define(
  'Report',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    senderName: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    },
    senderEmail: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    },
    replyTo: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    },
    email: {
      type: Sequelize.JSONB,
      defaultValue: {
        subject: '',
        body: '',
      },
      allowNull: false,
    },
    attachments: {
      type: Sequelize.JSONB,
      defaultValue: [],
      allowNull: false,
    },
    cc: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
    },
    bcc: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
    },
  },
);
