const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../../services/user');

const verify = promisify(jwt.verify);

module.exports = async (req, res, next) => {
  req.user = null;
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  const [, token] = authorization.split(' ');
  // TODO if token expired, cant access public queries
  try {
    const { userId } = await verify(token, process.env.FOREST_ENV_SECRET);
    req.user = await User.findById(userId);
  } catch (error) {
    console.error(error);
    return res.status(401).end();
  }
  return next();
};
