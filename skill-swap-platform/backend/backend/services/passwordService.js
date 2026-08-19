const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password. Never store or log plain-text passwords.
 * @param {string} plainPassword
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Compares a plain-text password against a stored bcrypt hash.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
