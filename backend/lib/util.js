const { createHash } = require('crypto');

module.exports.gravatarPicture = email => {
  const hash = createHash('md5').update(email).digest('hex');
  return {
    name: '',
    url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
    image: true,
  };
};

module.exports.generateInvitationEmailContent = (
  { subject, body },
  organizationName,
  userName,
  url,
) => {
  const replace = string =>
    string
      .replace(/{{organization}}/g, organizationName)
      .replace(/{{firstname}}/g, userName.firstName)
      .replace(/{{lastname}}/g, userName.lastName)
      .replace(/{{url}}/g, url);
  return {
    subject: replace(subject),
    body: replace(body),
  };
};
