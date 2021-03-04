const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  email: { type: String },
  amount: { type: String },
  Date: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
