const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const UserService = require('../services/user');

const verify = promisify(jwt.verify);

module.exports = async (req, res) => {
  const { changeEmailToken } = req.query;
  const { email } = await verify(changeEmailToken, process.env.FOREST_ENV_SECRET);
  const user = await UserService.findByChangeEmailToken(changeEmailToken);
  user.update({ changeEmailToken: null, email, verified: true });
  const { shortId } = await user.getOrganization();
  const url = `${process.env.FRONTEND_URL}/organization/${shortId}`;
  res.redirect(url);
};
