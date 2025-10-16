const { Schema, model } = require('mongoose');

const paymentSchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['INSURANCE', 'CARD', 'CASH', 'GOVERNMENT'],
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING'
    },
    intentId: { type: String, sparse: true, unique: true },
    authCode: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = model('Payment', paymentSchema);
