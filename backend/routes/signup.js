const { stringify } = require('querystring');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const verify = promisify(jwt.verify);

module.exports = async (req, res) => {
  const { token } = req.query;
  const { name: { firstName, lastName }, email, organizationShortId: shortId } = await verify(
    token,
    process.env.FOREST_ENV_SECRET,
  );
  const queryString = stringify({
    firstName,
    lastName,
    email,
    token,
  });
  const url = `${process.env.FRONTEND_URL}/organization/${shortId}/signup?${queryString}`;
  res.redirect(url);
};
