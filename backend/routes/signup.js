const { stringify } = require('querystring');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const verify = promisify(jwt.verify);

module.exports = async (req, res) => {
  const { token } = req.query;
  const { name: { firstName, lastName }, email, organizationShortId } = await verify(
    token,
    process.env.FOREST_ENV_SECRET,
  );
  const frontendUrl = process.env.FRONTEND_URL;
  const queryString = stringify({
    firstName,
    lastName,
    email,
    token,
  });
  const url = `${frontendUrl}/organization/${organizationShortId}/signup?${queryString}`;
  res.redirect(url);
};
