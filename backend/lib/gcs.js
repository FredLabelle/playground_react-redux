const storage = require('@google-cloud/storage');
const request = require('request');

const credentials = require('./InvestorX-d9fe1a54b936.json');

const gcs = storage({ credentials });

const bucket = gcs.bucket(credentials.project_id);

const uploadFileFromUrl = (url, name) =>
  new Promise((resolve, reject) => {
    request(url).on('response', response => {
      const contentType = response.headers['content-type'];
      const file = bucket.file(name);
      const writeStream = file.createWriteStream({
        metadata: { contentType },
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

const deleteFile = name => bucket.file(name).delete();

module.exports = { uploadFileFromUrl, deleteFile };
