const passport = require('passport');
/* const { Strategy: LocalStrategy } = require('passport-local');
const jwt = require('jsonwebtoken');

const User = require('../services/user');
const Organization = require('../services/organization');*/

/* passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});*/

/* const signupStrategy = new LocalStrategy({
  usernameField : 'email',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const organization = await Organization.findByShortId(req.body.organizationShortId);
    const canSignup = await User.canSignup(email, organization.id);
    if (!canSignup) {
      return done(null, false);
    }
    const user = await User.signup(req.body, organization);
    const token = await jwt.sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
    Object.assign(user, { token });
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
});

passport.use('local-signup', signupStrategy);

const loginStrategy = new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const organization = await Organization.findByShortId(req.body.organizationShortId);
    const user = await User.findByEmail(email, organization.id);
    const passwordsMatch = await User.passwordsMatch(password, user.password);
    if (!passwordsMatch) {
      return done(null, false);
    }
    const token = await jwt.sign({ userId: user.id }, process.env.FOREST_ENV_SECRET);
    Object.assign(user, { token });
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
});

passport.use('local-login', loginStrategy);*/

module.exports = passport;
