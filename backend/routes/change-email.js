const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const UserService = require('../services/User');

const verify = promisify(jwt.verify);

module.exports = async (req, res) => {
  const { changeEmailToken } = req.query;
  const { email } = await verify(changeEmailToken, process.env.FOREST_ENV_SECRET);
  const User = await UserService.findByChangeEmailToken(changeEmailToken);
  User.update({ changeEmailToken: null, email });
  const { shortId } = await User.getOrganization();
  const url = `${process.env.FRONTEND_URL}/organization/${shortId}`;
  res.redirect(url);
};
