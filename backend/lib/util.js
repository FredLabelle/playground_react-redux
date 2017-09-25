const { createHash } = require('crypto');

module.exports.gravatarPicture = email => {
  const hash = createHash('md5').update(email).digest('hex');
  return {
    name: 'Gravatar',
    url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
    uploaded: true,
  };
};
