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
      netAmount: 2456.21,
      grossAmount: 2123,
      purchaseOrder: 'KINDER12345',
      status: 'pending',
      debtor: 'Kinder'
    });

    await organization.createInvoice({
      customId: 'EF1B4978',
      netAmount: 36500,
      grossAmount: 24253.98,
      purchaseOrder: 'BUENO12345',
      status: 'pending',
      debtor: 'Bueno'
    });

    await organization.createInvoice({
      customId: 'EF1A2341',
      netAmount: 9999,
      grossAmount: 8320.10,
      purchaseOrder: 'COUNTRY12345',
      status: 'paid',
      debtor: 'Country'
    });

    return res.json({ success: 'Done!' });
    
  } catch (error) {
    console.error('Seed Database:', error);
    return res.json({ error: 'ERROR' });
  }
};
