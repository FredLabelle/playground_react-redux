const OrganizationService = require('../../services/organization');

module.exports = async (req, res) => {
  const invoicePayload = req.body;
  const customId = invoicePayload.invoice_number ? invoicePayload.invoice_number : "12345";
  const netAmount = invoicePayload.totals_net ? invoicePayload.totals_net : 0;
  const creationDate = invoicePayload.invoice_creation_date_iso8601 ? new Date(invoicePayload.invoice_creation_date_iso8601) : Date.now();
  const dueDate = invoicePayload.invoice_due_date_iso8601 ? new Date(invoicePayload.invoice_due_date_iso8601) : Date.now() + (45 * 24 * 60 * 60 * 1000);

  try {
    const Organization = await OrganizationService.findByShortId('eclub');
    await Organization.createInvoice({
      customId: customId,
      netAmount: {
        amount: netAmount,
        currency: 'eur'
      },
      status: 'pending',
      debtor: 'aircall.io',
      creationDate: creationDate,
      dueDate: dueDate
    })
  } catch (error) {
      console.error('Create Invoice from DocParser WebHook:', error);
      return res.json({ error: 'ERROR' });
  }

  res.json({
    ts: Date.now(),
    env: process.env.NODE_ENV,
  });
};
