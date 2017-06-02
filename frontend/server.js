const express = require('express');
const { parse } = require('url');
const next = require('next');
const cookiesMiddleware = require('universal-cookie-express');

const app = next({ dev: process.env.NODE_ENV === 'development' });

app.prepare().then(() => {
  const route = path => (req, res) => {
    app.render(req, res, path, Object.assign({}, req.query, req.params));
  };
  const server = express();
  server.use(cookiesMiddleware());
  server.get('/organization/:shortId', route('/'));
  server.get('/organization/:shortId/signup', route('/signup'));
  server.get('/organization/:shortId/login', route('/login'));
  server.get('/organization/:shortId/account', route('/account'));
  const handle = app.getRequestHandler();
  server.get('*', (req, res) => {
    handle(req, res, parse(req.url, true));
  });
  server.listen(3000, error => {
    if (error) {
      throw error;
    }
    console.info('InvestorX frontend listening on port 3000! ✅');
  });
});
