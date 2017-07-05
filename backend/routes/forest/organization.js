const bcrypt = require('bcryptjs');

const sequelize = require('../../models/sequelize');
const { Organization } = require('../../models');
const { gravatarPicture } = require('../../lib/util');

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
        investmentMechanisms: {
          optOutTime: '5',
          defaultCurrency: 'eur',
        },
        invitationEmail: {
          subject: "You've been invited to join {{organization}}!",
          body: [
            'Dear {{firstname}},',
            '',
            'Here is the link to signup to the club:',
            '',
            '{{signup_link}}',
            '',
            'Best,',
          ].join('\n'),
        },
      },
    });
    const seed = await organization.createDealCategory({
      order: 0,
      name: 'Pre-seed / Seed',
    });
    const laterStage = await organization.createDealCategory({
      order: 1,
      name: 'Later stage (Series A, B, etc.)',
      investmentMechanisms: ['DealByDeal'],
    });
    const email = 'simon.arvaux@gmail.com';
    const password = await bcrypt.hash('password', 10);
    const user = await organization.createUser({
      name: {
        firstName: 'Simon',
        lastName: 'Arvaux',
      },
      email,
      password,
      picture: [gravatarPicture(email)],
      role: 'investor',
    });
    await user.createInvestorProfile({
      status: 'joined',
      investmentSettings: {
        [laterStage.id]: { interested: true },
      },
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
    const spendesk = await organization.createCompany({
      name: 'Spendesk',
      website: 'https://www.spendesk.com',
      description: 'Smart spending solution for teams',
    });
    const forest = await organization.createCompany({
      name: 'Forest',
      website: 'https://www.forestadmin.com/',
      description: 'The plug and play Admin Interface',
    });
    const deal = await organization.createDeal({
      companyId: spendesk.id,
      categoryId: laterStage.id,
      name: 'Follow',
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
    });
    await organization.createTicket({
      userId: user.id,
      dealId: deal.id,
      amount: {
        amount: '50000',
        currency: 'eur',
      },
    });
    await organization.createTicket({
      userId: user.id,
      dealId: deal.id,
      amount: {
        amount: '25000',
        currency: 'eur',
      },
    });
    await organization.createDeal({
      companyId: forest.id,
      categoryId: seed.id,
      name: 'Seed',
      totalAmount: {
        amount: '300000',
        currency: 'usd',
      },
      minTicket: {
        amount: '5000',
        currency: 'usd',
      },
      maxTicket: {
        amount: '',
        currency: 'usd',
      },
      carried: '5',
      hurdle: '0',
    });
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
