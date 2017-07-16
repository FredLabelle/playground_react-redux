const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

const authMiddleware = require('../routes/auth/middleware');
const schema = require('./schema');
const Admin = require('../services/admin');
const Company = require('../services/company');
const Deal = require('../services/deal');
const Investor = require('../services/investor');
const Organization = require('../services/organization');
const Ticket = require('../services/ticket');

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
        Admin,
        Company,
        Deal,
        Investor,
        Organization,
        Ticket,
      },
    };
  }),
);

if (process.env.NODE_ENV === 'development') {
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

module.exports = router;
