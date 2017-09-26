require('dotenv').config({ path: `.env/${process.env.NODE_ENV}.env` });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const liana = require('forest-express-sequelize');

const appRouter = require('./routes/router');
const graphqlRouter = require('./graphql/router');
const forestRouter = require('./routes/forest/router');
const sequelize = require('./models/sequelize');
const { seedDatabase } = require('./routes/forest/organization');

const initSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.info('Postgres: connection has been established successfully.');
    await sequelize.sync();
    seedDatabase(null, { json() {} });
    console.info('Postgres: database synced successfully.');
  } catch (error) {
    console.error(`Postgres error: ${error}`);
  }
};

initSequelize();

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
  app.use(appRouter);

  app.use(graphqlRouter);
} else {
  app.use('/api', appRouter);
  app.use('/api', graphqlRouter);
}

const forestMiddleware = liana.init({
  modelsDir: `${__dirname}/models`,
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  sequelize,
});
app.use(forestMiddleware);
app.use('/forest', forestRouter);

app.listen(process.env.PORT, async () => {
  console.info(`InvoiceX backend listening on port ${process.env.PORT}! ✅`);
});
