require('dotenv').config({ path: `.env/${process.env.NODE_ENV}.env` });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const session = require('express-session');
const liana = require('forest-express-sequelize');

const appRouter = require('./routes/router');
const authRouter = require('./routes/auth/router');
const graphqlRouter = require('./graphql/router');
const forestRouter = require('./routes/forest/router');
const passport = require('./lib/passport');
const sequelize = require('./models/sequelize');

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
/* app.use(session({
  cookie: { secure: process.env.NODE_ENV === 'production' },
  resave: false,
  saveUninitialized: false,
  secret: process.env.FOREST_AUTH_SECRET,
}));*/
app.use(passport.initialize());
// app.use(passport.session());
app.use(appRouter);
app.use('/auth', authRouter);
app.use(graphqlRouter);
const forestMiddleware = liana.init({
  modelsDir: `${__dirname}/models`,
  envSecret: process.env.FOREST_ENV_SECRET,
  authSecret: process.env.FOREST_AUTH_SECRET,
  sequelize,
});
app.use(forestMiddleware);
app.use('/forest', forestRouter);

app.listen(process.env.PORT, async () => {
  console.info(`InvestorX backend listening on port ${process.env.PORT}! ✅`);
});
