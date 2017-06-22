const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const UserService = require('../services/user');

const verify = promisify(jwt.verify);

module.exports = async (req, res) => {
  const { token } = req.query;
  const { email } = await verify(token, process.env.FOREST_ENV_SECRET);
  const user = await UserService.findByChangeEmailToken(token);
  user.update({ changeEmailToken: null, email, verified: true });
  const frontendUrl = process.env.FRONTEND_URL;
  const { shortId } = await user.getOrganization();
  const url = `${frontendUrl}/organization/${shortId}`;
  res.redirect(url);
};
