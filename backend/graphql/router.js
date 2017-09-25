const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');

const schema = require('./schema');
const authMiddleware = require('../routes/auth/middleware');
const User = require('../services/user');
const Organization = require('../services/organization');


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
        User,
        Organization,
      },
    };
  }),
);

if (process.env.NODE_ENV === 'development') {
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

module.exports = router;
