const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'staff', 'manager', 'admin'],
      default: 'patient'
    },
    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = model('User', userSchema);
