const express = require('express');

const indexRoute = require('.');
const changeEmailRoute = require('./change-email');
const signupRoute = require('./signup');
const invoiceParsingRoute = require('./docParser/invoiceParsing')

const router = express.Router();

router.get('/', indexRoute);
router.get('/change-email', changeEmailRoute);
router.get('/signup', signupRoute);
router.post('/docParser', invoiceParsingRoute);

module.exports = router;
