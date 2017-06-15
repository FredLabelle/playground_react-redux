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
    await organization.createCompany({
      name: 'Aircall',
      website: 'https://aircall.io',
      description: 'Your phone connected to your business tools.',
    });
    const company = await organization.createCompany({
      name: 'Spendesk',
      website: 'https://www.spendesk.com',
      description: 'Smart spending solution for teams.',
    });
    await organization.createCompany({
      name: 'Hivy',
      website: 'https://hivyapp.com',
      description: 'The Office Management Platform.',
    });
    await organization.createCompany({
      name: 'Forest',
      website: 'https://www.forestadmin.com/',
      description: 'The plug and play Admin Interface.',
    });
    await organization.createDeal({
      category: 'Serie A',
      totalAmount: {
        amount: '1300000',
        currency: 'usd',
      },
      minTicket: {
        amount: '25000',
        currency: 'usd',
      },
      maxTicket: {
        amount: '',
        currency: 'usd',
      },
      carried: '20',
      deck: {
        name: '',
        url: '',
        image: false,
      },
      companyId: company.id,
    });
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
