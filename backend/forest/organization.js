const liana = require('forest-express-sequelize');

liana.collection('Organization', {
  actions: [
    {
      name: 'Seed Database',
      // endpoint: '/forest/actions/seed-database',
      global: true,
    },
  ],
});
