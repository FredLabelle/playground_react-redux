const express = require('express');

const indexRoute = require('.');

const router = express.Router();

router.get('/', indexRoute);

module.exports = router;
