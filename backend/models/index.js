const User = require('./user');
const Organization = require('./organization');
const Invoice = require('./invoice');

// adds fk
User.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createUser
Organization.hasMany(User, { foreignKey: 'organizationId' });

Organization.hasMany(Invoice, { foreignKey: 'organizationId' });

Invoice.belongsTo(Organization, { foreignKey: 'organizationId'});

module.exports = {
  User,
  Organization,
  Invoice,
};
