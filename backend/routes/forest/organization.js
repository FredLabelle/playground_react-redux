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
        emailDomains: ['e-founders.com', 'efounders.co'],
      },
      parametersSettings: {
        investment: {
          dealCategories: ['Seed', 'Serie A', 'Serie B', 'Later Stage'],
          defaultCurrency: 'eur',
        },
        invitationEmail: {
          subject: "You've been invited to join {{organization}}!",
          body: [
            'Dear {{firstname}},',
            '',
            'Here is the link to signup to the club:',
            '',
            '{{url}}',
            '',
            'Best,',
          ].join('\n'),
        },
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
      name: 'Mailjet',
      website: 'https://www.mailjet.com',
      description: 'One Solution To Power Your Email',
    });
    await organization.createCompany({
      name: 'TextMaster',
      website: 'https://www.textmaster.com',
      description: 'Your Professional SaaS Translation Service',
    });
    await organization.createCompany({
      name: 'Mention',
      website: 'https://mention.com',
      description: 'Monitor your brand anywhere online',
    });
    await organization.createCompany({
      name: 'Front',
      website: 'https://frontapp.com',
      description: 'The shared inbox for collaborative teams',
    });
    await organization.createCompany({
      name: 'Aircall',
      website: 'https://aircall.io',
      description: 'Your phone connected to your business tools',
    });
    await organization.createCompany({
      name: 'Hivy',
      website: 'https://hivyapp.com',
      description: 'The Office Management Platform',
    });
    const company = await organization.createCompany({
      name: 'Spendesk',
      website: 'https://www.spendesk.com',
      description: 'Smart spending solution for teams',
    });
    await organization.createCompany({
      name: 'Forest',
      website: 'https://www.forestadmin.com/',
      description: 'The plug and play Admin Interface',
    });
    const deal = await organization.createDeal({
      name: 'Follow',
      category: 'Serie A',
      totalAmount: {
        amount: '3000000',
        currency: 'eur',
      },
      minTicket: {
        amount: '25000',
        currency: 'eur',
      },
      maxTicket: {
        amount: '',
        currency: 'eur',
      },
      carried: '20',
      hurdle: '10',
      companyId: company.id,
    });
    const user = await UserService.findByEmail('simon.arvaux@gmail.com', organization.id);
    await organization.createTicket({
      userId: user.id,
      dealId: deal.id,
      amount: {
        amount: '50000',
        currency: 'usd',
      },
    });
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
