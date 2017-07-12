const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

const authMiddleware = require('../routes/auth/middleware');
const schema = require('./schema');
const Company = require('../services/company');
const Deal = require('../services/deal');
const Organization = require('../services/organization');
const Ticket = require('../services/ticket');
const User = require('../services/user');

const router = express.Router();

router.use(
  '/graphql',
  authMiddleware,
  graphqlExpress(req => {
    const query = req.query.query || req.body.query;
    if (query && query.length > 2048) {
      throw new Error('Query too large.');
    }
    return {
      schema,
      context: {
        user: req.user,
        Company,
        Deal,
        Organization,
        Ticket,
        User,
      },
    };
  }),
);

if (process.env.NODE_ENV === 'development') {
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

module.exports = router;
