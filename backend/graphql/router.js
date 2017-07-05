const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

const authMiddleware = require('../routes/auth/middleware');
const schema = require('./schema');
const Organization = require('../services/organization');
const User = require('../services/user');
const Deal = require('../services/deal');

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
        Organization,
        User,
        Deal,
      },
    };
  }),
);

if (process.env.NODE_ENV === 'development') {
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

module.exports = router;
