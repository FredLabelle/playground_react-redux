const storage = require('@google-cloud/storage');
const request = require('request');

const credentials = require('./InvestorX-d9fe1a54b936.json');

const gcs = storage({ credentials });

const bucket = gcs.bucket(credentials.project_id);

module.exports.uploadFile = ({ url, name }, fileName) =>
  new Promise((resolve, reject) => {
    request(url).on('response', response => {
      const contentType = response.headers['content-type'];
      const file = bucket.file(fileName);
      const writeStream = file.createWriteStream({
        metadata: {
          contentType,
          contentDisposition: `inline; filename=${name}`,
        },
      });
      response
        .pipe(writeStream)
        .on('finish', async () => {
          try {
            const [signedUrl] = await file.getSignedUrl({
              action: 'read',
              // in 10 years
              expires: Date.now() + 315360000 * 1000,
            });
            resolve(signedUrl);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  });

module.exports.deleteFiles = prefix => bucket.deleteFiles({ prefix, force: true });
