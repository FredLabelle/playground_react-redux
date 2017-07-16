const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { Admin, Investor } = require('../../models');

const verify = promisify(jwt.verify);

const roleToModel = role => {
  switch (role) {
    case 'admin': {
      return Admin;
    }
    case 'investor': {
      return Investor;
    }
    default: {
      break;
    }
  }
  return null;
};

module.exports = async (req, res, next) => {
  req.user = null;
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  const [, token] = authorization.split(' ');
  // TODO if token expired, cant access public queries
  try {
    const { userId, role } = await verify(token, process.env.FOREST_ENV_SECRET);
    req.user = await roleToModel(role).findById(userId);
  } catch (error) {
    console.error(error);
    return res.status(401).end();
  }
  return next();
};
