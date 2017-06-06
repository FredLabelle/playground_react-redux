const googleOAuth2Client = require('../../../lib/google-oauth2-client');

module.exports = (req, res) => {
  const url = googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    // access_type: 'offline',
    // select_account: force google to show account chooser
    // consent: force google to show consent screen
    prompt: 'select_account consent',
  });
  res.redirect(url);
};
