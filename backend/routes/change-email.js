const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const InvestorService = require('../services/investor');

const verify = promisify(jwt.verify);

module.exports = async (req, res) => {
  const { changeEmailToken } = req.query;
  const { email } = await verify(changeEmailToken, process.env.FOREST_ENV_SECRET);
  const investor = await InvestorService.findByChangeEmailToken(changeEmailToken);
  investor.update({ changeEmailToken: null, email });
  const { shortId } = await investor.getOrganization();
  const url = `${process.env.FRONTEND_URL}/organization/${shortId}`;
  res.redirect(url);
};
