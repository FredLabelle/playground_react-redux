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
            'We\'re very happy to have you join the eFounders\' {{organization}}.',
            '',
            'In order to join, please click the signup button: {{signup_link}}',
            '',
            'Once logged in, please verify that the data we\'ve already gathered is correct.',
            '',
            'You are also invited to complete your investment profile with regards ' +
              'to early stage and/or later later stage opportunities.',
            '',
            'All feedback to make the {{organization}} more efficient is always welcome!',
            '',
            'Best regards',
            '',
            'eFounders',
          ].join('\n'),
        },
      },
    });
    /* const seed = */ await organization.createDealCategory({
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
    const investor = await organization.createInvestor({
      name: {
        firstName: 'Simon',
        lastName: 'Arvaux',
      },
      email,
      password,
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
    /* const forest = */ await organization.createCompany({
      name: 'Forest',
      website: 'https://www.forestadmin.com',
      description: 'The plug and play Admin Interface',
    });
    const foxIntelligence = await organization.createCompany({
      name: 'foxintelligence',
      website: 'https://www.foxintelligence.fr',
      description: 'We generate the best market intelligence. We protect data privacy.',
    });
    const deal = await organization.createDeal({
      companyId: spendesk.id,
      categoryId: laterStage.id,
      name: 'Follow',
      roundSize: {
        amount: '3000000',
        currency: 'eur',
      },
      premoneyValuation: {
        amount: '6000000',
        currency: 'eur',
      },
      amountAllocatedToOrganization: {
        amount: '600000',
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
      investorId: investor.id,
      dealId: deal.id,
      amount: {
        amount: '50000',
        currency: 'eur',
      },
    });
    await organization.createTicket({
      investorId: investor.id,
      dealId: deal.id,
      amount: {
        amount: '25000',
        currency: 'eur',
      },
    });
    await organization.createDeal({
      companyId: foxIntelligence.id,
      categoryId: laterStage.id,
      name: 'Serie B - GlobalFounders',
      roundSize: {
        amount: '10300000',
        currency: 'eur',
      },
      premoneyValuation: {
        amount: '23000000',
        currency: 'eur',
      },
      amountAllocatedToOrganization: {
        amount: '1300000',
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
      carried: '5',
      hurdle: '0',
    });
    return res.json({ success: 'Done!' });
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
