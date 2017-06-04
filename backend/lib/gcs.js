const storage = require('@google-cloud/storage');
const request = require('request-promise');

const credentials = require('./InvestorX-d9fe1a54b936.json');

const gcs = storage({ credentials });

const bucket = gcs.bucket(credentials.project_id);

const uploadImageFromUrl = (url, name) =>
  new Promise((resolve, reject) => {
    request(url).on('response', response => {
      const contentType = response.headers['content-type'];
      const file = bucket.file(name);
      const writeStream = file.createWriteStream({
        metadata: { contentType },
      });
      response
        .pipe(writeStream)
        .on('finish', () => {
          const options = {
            action: 'read',
            // in 10 years
            expires: Date.now() + 315360000 * 1000,
          };
          file.getSignedUrl(options, (error, signedUrl) => resolve(signedUrl));
        })
        .on('error', reject);
    });
  });

module.exports = { uploadImageFromUrl };
