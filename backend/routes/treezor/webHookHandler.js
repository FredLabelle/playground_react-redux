const OrganizationService = require('../../services/organization');
const InvoiceService = require('../../services/invoice');

module.exports = async (req, res) => {
  //Take first transaction for the POC
  const transac = req.body.object ? req.body.object === 'transaction' : false

  if( transac ) {
    const transacPayload = req.body["object_pay load"].transactions[0];
    const description = transacPayload.description ? transacPayload.description : 'Unknown';
    const amount = transacPayload.amount ? transacPayload.amount : "O";

    try {
      const Organization = await OrganizationService.findByShortId('eclub');
      const payment = await Organization.createPayment({
        amount: {
          amount: amount,
          currency: 'eur'
        },
        origin: 'aircall.io',
        description: description,
        status: 'unmatched'
      })

      const parsedInvoiceId = description.split('#')[1];
      console.log("parsed-----------: " + parsedInvoiceId);
      if (parsedInvoiceId) {
        const invoice = await InvoiceService.findByCustomId(parsedInvoiceId);
        if(invoice){
          await invoice.update({
            status: 'paid'
          }).then(() => {})
          await payment.update({
              status: 'matched'
            }).then(() => {})
        }
        
      }
    } catch (error) {
        console.error('Create Payment from Treezor WebHook:', error);
        return res.json({ error: 'ERROR' });
    }
  }

  res.json({
    ts: Date.now(),
    env: process.env.NODE_ENV,
  });
};
