require('dotenv').config({ path: `.env/${process.env.NODE_ENV}.env` });
const { promisify } = require('util');
const express = require('express');
const { parse } = require('url');
const next = require('next');
const cookiesMiddleware = require('universal-cookie-express');
const jwt = require('jsonwebtoken');

const app = next({ dev: process.env.NODE_ENV === 'development' });

const verify = promisify(jwt.verify);

app.prepare().then(() => {
  const route = path => (req, res) => {
    app.render(req, res, path, Object.assign({}, req.query, req.params));
  };
  const server = express();
  server.use(cookiesMiddleware());
  server.get('/organization/:organizationShortId/signup', route('/signup'));
  server.get('/organization/:organizationShortId/login', route('/login'));
  server.get('/organization/:organizationShortId', route('/'));
  server.get('/organization/:organizationShortId/settings', route('/settings'));


  const handle = app.getRequestHandler();
  server.get('*', (req, res) => {
    handle(req, res, parse(req.url, true));
  });
  server.listen(3000, error => {
    if (error) {
      throw error;
    }
    console.info('InvoiceX frontend listening on port 3000! ✅');
  });
});
