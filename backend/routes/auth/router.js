const express = require('express');

/* const localSignupRoute = require('./local/signup');
const localLoginRoute = require('./local/login');
const localLogoutRoute = require('./local/logout');*/

const googleIndexRoute = require('./google');
const googleCallbackRoute = require('./google/callback');

const router = express.Router();

/* router.post('/local/signup', localSignupRoute);
router.post('/local/login', localLoginRoute);
router.post('/local/logout', localLogoutRoute);*/

router.get('/google', googleIndexRoute);
router.get('/google/callback', googleCallbackRoute);

module.exports = router;
