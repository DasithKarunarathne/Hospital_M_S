const { Schema, model } = require('mongoose');

const demographicsSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true }
  },
  { _id: false }
);

const insuranceSchema = new Schema(
  {
    provider: { type: String, trim: true },
    policyNo: { type: String, trim: true },
    validUntil: { type: Date }
  },
  { _id: false }
);

const patientSchema = new Schema(
  {
    demographics: { type: demographicsSchema, required: true },
    insurance: { type: insuranceSchema },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    versionKey: '__v',
    optimisticConcurrency: true
  }
);

patientSchema.index({ 'demographics.lastName': 1, 'demographics.firstName': 1 });

module.exports = model('Patient', patientSchema);
