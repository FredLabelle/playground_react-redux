const bcrypt = require('bcryptjs');

const sequelize = require('../../models/sequelize');
const { Organization, Invoice } = require('../../models');

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

    await organization.createInvoice({
      customId: 'EF12345',
      netAmount: {
        amount: '23000',
        currency: 'eur'
      },
      grossAmount: {
        amount: '19801.23',
        currency: 'eur'
      },
      purchaseOrder: 'KINDER12345',
      status: 'pending',
      debtor: 'aircall.io'
    });

    await organization.createInvoice({
      customId: 'EF1B4978',
      netAmount: {
        amount: '4569.23',
        currency: 'eur'
      },
      grossAmount: {
        amount: '3214.1',
        currency: 'eur'
      },
      purchaseOrder: 'BUENO12345',
      status: 'pending',
      debtor: 'aircall.io'
    });

    await organization.createInvoice({
      customId: 'EF1A2341',
      netAmount: {
        amount: '37500',
        currency: 'eur'
      },
      grossAmount: {
        amount: '31000',
        currency: 'eur'
      },
      purchaseOrder: 'COUNTRY12345',
      status: 'paid',
      debtor: 'aircall.io'
    });

    return res.json({ success: 'Done!' });

  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
