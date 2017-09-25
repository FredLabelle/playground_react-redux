const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const verify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  const [, token] = authorization.split(' ');
  // TODO if token expired, cant access public queries
  try {
    const { userId, role } = await verify(token, process.env.FOREST_ENV_SECRET);
    req.user = await User.findById(userId);
  } catch (error) {
    console.error(error);
  }
  return next();
};
