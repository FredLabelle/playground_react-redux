const express = require('express');

const indexRoute = require('.');
const changeEmailRoute = require('./change-email');

const router = express.Router();

router.get('/', indexRoute);
router.get('/change-email', changeEmailRoute);

module.exports = router;
