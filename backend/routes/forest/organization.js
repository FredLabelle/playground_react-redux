const sequelize = require('../../models/sequelize');
const { Organization } = require('../../models');
const UserService = require('../../services/user');

module.exports.seedDatabase = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    // return res.json({ error: 'ERROR' });
  }
  try {
    await sequelize.sync({ force: true });
    const organization = await Organization.create({
      shortId: 'eclub',
      generalSettings: {
        name: 'eClub',
        website: 'https://efounders.co',
        description: 'eFounders club',
        emailDomains: ['e-founders.com'],
      },
    });
    await UserService.signup({
      name: {
        firstName: 'Simon',
        lastName: 'Arvaux',
      },
      email: 'simon.arvaux@gmail.com',
      password: 'password',
      investmentSettings: {
        type: 'individual',
        dealCategories: [],
        averageTicket: {
          amount: '5000',
          currency: 'usd',
        },
        mechanism: 'dealByDeal',
      },
      organizationId: organization.id,
    });
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
