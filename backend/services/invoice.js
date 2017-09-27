const DataLoader = require('dataloader');
const omit = require('lodash/omit');

const { Invoice } = require('../models');

const InvoiceService = {

  shortIdLoader() {
    return new DataLoader(shortIds =>
      Promise.all(
        shortIds.map(shortId =>
          Invoice.findOne({
            where: { shortId },
          }),
        ),
      ),
    );
  },
  findById(id) {
    return Invoice.findById(id);
  },
  findByShortId(shortId) {
    return Invoice.findOne({
      where: { shortId },
    });
  },

  findByCustomId(customId){
    return Invoice.findOne({
      where: { customId },
    });
  },

  async invoice(shortId) {
    try {
      const invoice = await InvoiceService.findByShortId(shortId);
      return invoice.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async invoices() {
    try {
      const invoices = await Invoice.findAll();
      return invoices.map(invoice => invoice.toJSON());
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = InvoiceService;
