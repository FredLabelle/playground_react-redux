const { createHash } = require('crypto');

const { uploadFile, deleteFiles } = require('./gcs');

module.exports.gravatarPicture = email => {
  const hash = createHash('md5').update(email).digest('hex');
  return {
    name: 'Gravatar',
    url: `https://www.gravatar.com/avatar/${hash}?d=retro`,
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

module.exports.handleFilesUpdate = async (files, path) => {
  if (!files) {
    return null;
  }
  const folderName = `${process.env.NODE_ENV}/${path}`;
  if (files.length) {
    // TODO delete files not present in the new array!
    const promises = files.map(
      (file, index) =>
        file.uploaded ? Promise.resolve(file.url) : uploadFile(file, `${folderName}/${index}`),
    );
    const urls = await Promise.all(promises);
    return urls.map((url, index) => Object.assign({}, files[index], { url, uploaded: true }));
  }
  await deleteFiles(folderName);
  return [];
};
