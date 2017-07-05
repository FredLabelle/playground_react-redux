const { createHash } = require('crypto');

module.exports.gravatarPicture = email => {
  const hash = createHash('md5').update(email).digest('hex');
  return {
    name: '',
    url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
    image: true,
  };
};

module.exports.generateInvitationEmailContent = ({ subject, body }, organizationName, userName) => {
  const replace = string =>
    string
      .replace(/{{organization}}/g, organizationName)
      .replace(/{{firstname}}/g, userName.firstName)
      .replace(/{{lastname}}/g, userName.lastName);
  const replacedBody = replace(body);
  const { index } = replacedBody.match(/{{signup_link}}/);
  return {
    subject: replace(subject),
    beforeLink: replacedBody.substring(0, index).trim(),
    afterLink: replacedBody.substring(index + '{{signup_link}}'.length, replacedBody.length).trim(),
  };
};
