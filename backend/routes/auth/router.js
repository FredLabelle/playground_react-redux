const express = require('express');

const googleIndexRoute = require('./google');
const googleCallbackRoute = require('./google/callback');

const router = express.Router();

router.get('/google', googleIndexRoute);
router.get('/google/callback', googleCallbackRoute);

module.exports = router;
