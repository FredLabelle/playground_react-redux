const bcrypt = require('bcryptjs');

const sequelize = require('../../models/sequelize');
const { Organization } = require('../../models');

module.exports.seedDatabase = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.json({ error: 'ERROR' });
  }
  try {
    await sequelize.sync({ force: true });
    const organization = await Organization.create({
      shortId: process.env.NODE_ENV === 'production' ? '' : 'eclub',
      generalSettings: {
        name: 'eClub',
        website: 'https://efounders.co',
        description: 'eFounders club',
        emailDomains: ['e-founders.com', 'efounders.co'],
      },
    });
    const email = 'fred@gmail.com';
    const password = await bcrypt.hash('password', 10);
    const user = await organization.createUser({
      name: {
        firstName: 'Fred',
        lastName: 'Labelle',
      },
      email,
      password,
      status: 'joined',
    });

    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
