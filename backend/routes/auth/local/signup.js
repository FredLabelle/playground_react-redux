const passport = require('passport');

module.exports = (req, res, next) => {
  const passportMiddleware = passport.authenticate('local-signup', (error, user) => {
    if (error || !user) {
      return res.status(400).json({ success: false });
    }
    return res.json({
      success: true,
      token: user.token,
    });
  });
  return passportMiddleware(req, res, next);
};
