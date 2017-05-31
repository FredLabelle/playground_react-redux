const sequelize = require('../../models/sequelize');
const { Organization } = require('../../models');

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
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
