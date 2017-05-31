const express = require('express');
const liana = require('forest-express-sequelize');

const organization = require('./organization');

const router = express.Router();

router.post('/actions/seed-database', liana.ensureAuthenticated, organization.seedDatabase);

module.exports = router;
