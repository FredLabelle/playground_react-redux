require('dotenv').config({ path: `.env/${process.env.NODE_ENV}.env` });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const liana = require('forest-express-sequelize');

const appRouter = require('./routes/router');
const authRouter = require('./routes/auth/router');
const graphqlRouter = require('./graphql/router');
const forestRouter = require('./routes/forest/router');
const sequelize = require('./models/sequelize');

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const forestMiddleware = liana.init({
  modelsDir: `${__dirname}/models`,
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  sequelize,
});
app.use(forestMiddleware);

if (process.env.NODE_ENV === 'production') {
  app.use('/api', appRouter);
  app.use('/api/auth', authRouter);
  app.use('/api', graphqlRouter);
  app.use('/api/forest', forestRouter);
} else {
  app.use(cors());
  app.use(appRouter);
  app.use('/auth', authRouter);
  app.use(graphqlRouter);
  app.use('/forest', forestRouter);
}

app.listen(process.env.PORT, async () => {
  console.info(`InvestorX backend listening on port ${process.env.PORT}! ✅`);
});
