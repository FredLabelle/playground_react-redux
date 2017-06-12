require('dotenv').config({ path: `.env/${process.env.NODE_ENV}.env` });
const { promisify } = require('util');
const express = require('express');
const { parse } = require('url');
const next = require('next');
const cookiesMiddleware = require('universal-cookie-express');
const jwt = require('jsonwebtoken');

const app = next({ dev: process.env.NODE_ENV === 'development' });

const verify = promisify(jwt.verify);

const redirectToLoginMiddleware = async (req, res, nextCallback) => {
  const admin = req.url.startsWith('/admin') ? '/admin' : '';
  const { shortId } = req.params;
  try {
    const token = req.universalCookies.get('token') || req.query.token;
    const { role } = await verify(token, process.env.FOREST_ENV_SECRET);
    if (admin && role !== 'admin') {
      res.redirect(`/organization/${shortId}`);
    }
    nextCallback();
  } catch (error) {
    res.redirect(`${admin}/organization/${shortId}/login`);
  }
};

app.prepare().then(() => {
  const route = path => (req, res) => {
    app.render(req, res, path, Object.assign({}, req.query, req.params));
  };
  const server = express();
  server.use(cookiesMiddleware());
  server.get('/organization/:shortId/signup', route('/signup'));
  server.get('/organization/:shortId/login', route('/login'));
  server.get('/organization/:shortId', redirectToLoginMiddleware, route('/'));
  server.get('/organization/:shortId/settings', redirectToLoginMiddleware, route('/settings'));
  server.get('/admin/organization/:shortId/login', route('/admin/login'));
  server.get('/admin/organization/:shortId', redirectToLoginMiddleware, route('/admin'));
  server.get(
    '/admin/organization/:shortId/deals',
    redirectToLoginMiddleware,
    route('/admin/deals'),
  );
  server.get(
    '/admin/organization/:shortId/investors',
    redirectToLoginMiddleware,
    route('/admin/investors'),
  );
  server.get(
    '/admin/organization/:shortId/investors/new',
    redirectToLoginMiddleware,
    route('/admin/investors/new'),
  );
  server.get(
    '/admin/organization/:shortId/tickets',
    redirectToLoginMiddleware,
    route('/admin/tickets'),
  );
  server.get(
    '/admin/organization/:shortId/reports',
    redirectToLoginMiddleware,
    route('/admin/reports'),
  );
  server.get(
    '/admin/organization/:shortId/settings',
    redirectToLoginMiddleware,
    route('/admin/settings'),
  );
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
