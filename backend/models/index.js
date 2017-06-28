const Company = require('./company');
const DealCategory = require('./deal-category');
const Deal = require('./deal');
const InvestorProfile = require('./investor-profile');
const Organization = require('./organization');
const Ticket = require('./ticket');
const User = require('./user');

// adds fk
User.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createUser
Organization.hasMany(User, { foreignKey: 'organizationId' });

// adds fk
InvestorProfile.belongsTo(User, { foreignKey: 'userId' });
// provides createInvestorProfile
User.hasOne(InvestorProfile, { foreignKey: 'userId' /* , as: 'profile'*/ });

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
Ticket.belongsTo(User, { foreignKey: 'userId' });
// provides createTicket
User.hasMany(Ticket, { foreignKey: 'userId' });

module.exports = {
  Company,
  DealCategory,
  Deal,
  InvestorProfile,
  Organization,
  Ticket,
  User,
};
