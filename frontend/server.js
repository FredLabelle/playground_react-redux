require('dotenv').config({ path: `.env/${process.env.NODE_ENV}.env` });
const { promisify } = require('util');
const express = require('express');
const { parse } = require('url');
const next = require('next');
const cookiesMiddleware = require('universal-cookie-express');
const jwt = require('jsonwebtoken');

const app = next({ dev: process.env.NODE_ENV === 'development' });

const verify = promisify(jwt.verify);

const redirectMiddleware = async (req, res, nextCallback) => {
  const admin = req.url.startsWith('/admin') ? '/admin' : '';
  const { organizationShortId: shortId } = req.params;
  try {
    // if redirected to admin dashboard after admin login, get token from query string
    /*const token = req.query.token || req.universalCookies.get('token');
    const { role } = await verify(token, process.env.FOREST_ENV_SECRET);
    if (admin && role !== 'admin') {
      return res.redirect(`/organization/${shortId}`);
    }
    if (!admin && role === 'admin') {
      return res.redirect(`/admin/organization/${shortId}`);
    }*/
    return nextCallback();
  } catch (error) {
    return res.redirect(`${admin}/organization/${shortId}/login`);
  }
};

app.prepare().then(() => {
  const route = path => (req, res) => {
    app.render(req, res, path, Object.assign({}, req.query, req.params));
  };
  const server = express();
  server.use(cookiesMiddleware());
  server.get('/organization/:organizationShortId/signup', route('/signup'));
  server.get('/organization/:organizationShortId/login', route('/login'));
  server.get('/organization/:organizationShortId', route('/'));
  server.get('/organization/:organizationShortId/settings', redirectMiddleware, route('/settings'));

  // ------Admin routes ---------
  server.get('/admin/organization/:organizationShortId/signup', route('/signup'));
  server.get('/admin/organization/:organizationShortId/login', route('/login'));
  server.get(
    '/organization/:organizationShortId/settings/administrative',
    redirectMiddleware,
    route('/settings/administrative'),
  );
  server.get(
    '/admin/organization/:organizationShortId',
    redirectMiddleware,
    route('/admin'),
  );
  server.get(
    '/admin/organization/:organizationShortId/general',
    redirectMiddleware,
    route('/admin'),
  );
  server.get(
    '/admin/organization/:organizationShortId/users',
    redirectMiddleware,
    route('/admin/users'),
  );
  server.get(
    '/admin/organization/:organizationShortId/wallets',
    redirectMiddleware,
    route('/admin/wallets'),
  );

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
