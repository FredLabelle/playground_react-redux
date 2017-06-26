const express = require('express');

const indexRoute = require('.');
const changeEmailRoute = require('./change-email');
const signupRoute = require('./signup');

const router = express.Router();

router.get('/', indexRoute);
router.get('/change-email', changeEmailRoute);
router.get('/signup', signupRoute);

module.exports = router;
