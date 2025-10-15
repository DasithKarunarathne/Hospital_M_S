const bcrypt = require('bcrypt');
const User = require('../models/User');

const DEFAULT_USERS = [
  { email: 'doctor@hospital.test', role: 'doctor' },
  { email: 'staff@hospital.test', role: 'staff' },
  { email: 'manager@hospital.test', role: 'manager' }
];

const DEFAULT_PASSWORD = 'Password123!';

async function ensureUser({ email, role }) {
  const existing = await User.findOne({ email });

  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  return User.create({
    email,
    role,
    passwordHash
  });
}

async function seedUsers() {
  await Promise.all(DEFAULT_USERS.map((user) => ensureUser(user)));
}

module.exports = {
  seedUsers,
  DEFAULT_PASSWORD,
  DEFAULT_USERS
};
