const User = require('./user');
const Organization = require('./organization');

// adds fk
User.belongsTo(Organization, { foreignKey: 'organizationId' });
// provides createUser
Organization.hasMany(User, { foreignKey: 'organizationId' });

module.exports = {
  User,
  Organization,
};
