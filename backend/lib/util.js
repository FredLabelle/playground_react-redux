const { createHash } = require('crypto');
const get = require('lodash/get');

const { uploadFile, deleteFiles } = require('./gcs');

module.exports.gravatarPicture = email => {
  const hash = createHash('md5').update(email).digest('hex');
  return {
    name: 'Gravatar',
    url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
    image: true,
    uploaded: true,
  };
};

module.exports.generateInvitationEmailContent = (
  { subject, body },
  organizationName,
  { firstName, lastName },
) => {
  const replace = string =>
    string
      .replace(/{{organization}}/g, organizationName)
      .replace(/{{firstname}}/g, firstName)
      .replace(/{{lastname}}/g, lastName)
      .replace('Dear ,', 'Hello,');
  const replacedBody = replace(body);
  const { index } = replacedBody.match(/{{signup_link}}/);
  return {
    subject: replace(subject),
    beforeLink: replacedBody.substring(0, index).trim(),
    afterLink: replacedBody.substring(index + '{{signup_link}}'.length, replacedBody.length).trim(),
  };
};

module.exports.handleFilesUpdate = async (shortId, input, field) => {
  const files = get(input, field);
  if (!files) {
    return null;
  }
  const fieldName = field.split('.').pop();
  const env = process.env.NODE_ENV !== 'production' ? `-${process.env.NODE_ENV}` : '';
  const folderName = `${fieldName}${env}/${shortId}`;
  if (files.length) {
    const promises = files.map((file, index) =>
      file.uploaded
        ? Promise.resolve(file.url)
        : uploadFile(file, `${folderName}/${index}`)
    );
    const urls = await Promise.all(promises);
    return urls.map((url, index) => Object.assign({}, files[index], { url, uploaded: true }));
  }
  await deleteFiles(folderName);
  return [];
};
