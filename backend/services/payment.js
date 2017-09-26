const DataLoader = require('dataloader');
const omit = require('lodash/omit');

const { Payment } = require('../models');

const PaymentService = {

  shortIdLoader() {
    return new DataLoader(shortIds =>
      Promise.all(
        shortIds.map(shortId =>
          Payment.findOne({
            where: { shortId },
          }),
        ),
      ),
    );
  },
  findById(id) {
    return Payment.findById(id);
  },
  findByShortId(shortId) {
    return Payment.findOne({
      where: { shortId },
    });
  },
  async payment(shortId) {
    try {
      const payment = await PaymentService.findByShortId(shortId);
      return payment.toJSON();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async payments() {
    try {
      const payments = await Payment.findAll();
      console.log(payments)
      return payments.map(payment => payment.toJSON());
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

module.exports = PaymentService;
