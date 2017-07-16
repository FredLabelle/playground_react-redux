const Admin = require('./admin');
const Company = require('./company');
const DealCategory = require('./deal-category');
const Deal = require('./deal');
const Investor = require('./investor');
const Organization = require('./organization');
const Ticket = require('./ticket');

// adds fk
Admin.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createAdmin
Organization.hasMany(Admin, { foreignKey: 'organizationId' });

// adds fk
Investor.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createInvestor
Organization.hasMany(Investor, { foreignKey: 'organizationId' });

// adds fk
Company.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createCompany
Organization.hasMany(Company, { foreignKey: 'organizationId' });

// adds fk
DealCategory.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createDealCategory
Organization.hasMany(DealCategory, { foreignKey: 'organizationId' });

// adds fk
Deal.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createDeal
Organization.hasMany(Deal, { foreignKey: 'organizationId' });

// adds fk
Deal.belongsTo(Company, { foreignKey: 'companyId' });
// provides createDeal
Company.hasMany(Deal, { foreignKey: 'companyId' });

// adds fk
Deal.belongsTo(DealCategory, { foreignKey: 'categoryId' });
// provides createDeal
DealCategory.hasMany(Deal, { foreignKey: 'categoryId' });

// adds fk
Ticket.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createTicket
Organization.hasMany(Ticket, { foreignKey: 'organizationId' });

// adds fk
Ticket.belongsTo(Deal, { foreignKey: 'dealId' });
// provides createTicket
Deal.hasMany(Ticket, { foreignKey: 'dealId' });

// adds fk
Ticket.belongsTo(Investor, { foreignKey: 'investorId' });
// provides createTicket
Investor.hasMany(Ticket, { foreignKey: 'investorId' });

module.exports = {
  Admin,
  Company,
  DealCategory,
  Deal,
  Investor,
  Organization,
  Ticket,
};
