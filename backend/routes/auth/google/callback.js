const { promisify } = require('util');
const { stringify } = require('querystring');
const google = require('googleapis');

const googleOAuth2Client = require('../../../lib/google-oauth2-client');
const OrganizationService = require('../../../services/organization');
const UserService = require('../../../services/user');

const getToken = promisify(googleOAuth2Client.getToken).bind(googleOAuth2Client);

module.exports = async (req, res) => {
  try {
    const tokens = await getToken(req.query.code);
    googleOAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: googleOAuth2Client,
      version: 'v2',
    });
    const getProfile = promisify(oauth2.userinfo.v2.me.get).bind(oauth2.userinfo.v2.me);
    const profile = await getProfile();
    const organization = await OrganizationService.findByEmailDomain(profile.hd);
    if (!organization) {
      // create?
    }
    const token = await UserService.adminLogin(
      {
        name: { firstName: profile.given_name, lastName: profile.family_name },
        email: profile.email,
        role: 'admin',
        picture: {
          name: '',
          url: profile.picture,
          image: true,
        },
        emailDomain: profile.hd,
      },
      organization
    );
    const frontendUrl = process.env.FRONTEND_URL;
    const shortId = organization.shortId;
    const queryString = stringify({ token });
    const url = `${frontendUrl}/admin/organization/${shortId}?${queryString}`;
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.redirect(process.env.FRONTEND_URL);
  }
};
