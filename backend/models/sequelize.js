const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL);

// const { seedDatabase } = require('../routes/forest/organization');

const initSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.info('Postgres: connection has been established successfully.');
    await sequelize.sync();
    // seedDatabase();
    console.info('Postgres: database synced successfully.');
  } catch (error) {
    console.error(`Postgres error: ${error}`);
  }
};

initSequelize();

module.exports = sequelize;
