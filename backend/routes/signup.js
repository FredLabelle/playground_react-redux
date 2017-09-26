const { stringify } = require('querystring');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const verify = promisify(jwt.verify);

//TODO no need to parse invitation token anymore

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
    invited: true,
  });
  const url = `${process.env.FRONTEND_URL}/organization/${shortId}/signup?${queryString}`;
  res.redirect(url);
};
