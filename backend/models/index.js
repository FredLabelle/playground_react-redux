const Company = require('./company');
const Deal = require('./deal');
const Organization = require('./organization');
const User = require('./user');
const InvestorProfile = require('./investor-profile');

// adds fk
User.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createUser
Organization.hasMany(User, { foreignKey: 'organizationId' });

// adds fk
InvestorProfile.belongsTo(User, { foreignKey: 'userId' });
// provides createInvestorProfile
User.hasOne(InvestorProfile, { foreignKey: 'userId' });

// adds fk
Company.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createCompany
Organization.hasMany(Company, { foreignKey: 'organizationId' });

// adds fk
Deal.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createDeal
Organization.hasMany(Deal, { foreignKey: 'organizationId' });

// adds fk
Deal.belongsTo(Company, { foreignKey: 'companyId' });
// provides createDeal
Company.hasMany(Deal, { foreignKey: 'companyId' });

module.exports = {
  Company,
  Deal,
  Organization,
  User,
  InvestorProfile,
};
