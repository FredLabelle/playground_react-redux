const { createHash } = require('crypto');

module.exports.gravatarPicture = email => {
  const hash = createHash('md5').update(email).digest('hex');
  return {
    name: '',
    url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
    image: true,
  };
};

module.exports.generateInvitationEmailContent = (organization, { name }, url) => {
  const replace = string =>
    string
      .replace(/{{firstname}}/g, name.firstName)
      .replace(/{{lastname}}/g, name.lastName)
      .replace(/{{organization}}/g, organization.generalSettings.name)
      .replace(/{{url}}/g, url)
      .replace(/\n/g, '<br />');
  return {
    subject: replace(organization.parametersSettings.invitationEmail.subject),
    body: replace(organization.parametersSettings.invitationEmail.body),
  };
};
