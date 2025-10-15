const { Schema, model } = require('mongoose');

const receiptSchema = new Schema(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, unique: true },
    number: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
    payload: { type: Schema.Types.Mixed }
  },
  {
    versionKey: false
  }
);

module.exports = model('Receipt', receiptSchema);
