const sequelize = require('../../models/sequelize');
const { Organization } = require('../../models');
const UserService = require('../../services/user');

module.exports.seedDatabase = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    // return res.json({ error: 'ERROR' });
  }
  try {
    await sequelize.sync({ force: true });
    await Organization.create({
      name: 'eClub',
      shortId: 'eclub',
      website: 'https://efounders.co',
      invitationEmail: {
        subject: 'Welcome to {{organization}}',
        body: [
          'Dear {{firstName}},',
          '',
          'Here is the link to signup to the club: {{signupLink}}',
          '',
          'Thibaud',
        ].join('\n'),
      },
    });
    await UserService.signup({
      firstName: 'Simon',
      lastName: 'Arvaux',
      email: 'simon@e-founders.com',
      password: 'password',
      averageTicket: 5000,
      organizationShortId: 'eclub',
    });
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
