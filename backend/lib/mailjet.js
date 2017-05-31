const { connect } = require('node-mailjet');

const mailjet = connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);

exports.sendEmail = ({ fromEmail, fromName, to, subject, headers, templateId, vars }) => {
  const options = {
    FromEmail: fromEmail,
    FromName: fromName,
    Subject: subject,
    Headers: headers,
    'MJ-TemplateID': templateId,
    'MJ-TemplateLanguage': true,
    Recipients: [{ Email: to }],
    Vars: vars,
  };
  if (process.env.NODE_ENV === 'development') {
    console.info('======== BEGIN MAIL ========');
    console.info(options);
    console.info('========= END MAIL =========');
    return Promise.resolve();
  }
  return mailjet.post('send').request(options);
};
