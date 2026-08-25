const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/config');

/**
 * Signs a JWT for a given user id.
 * @param {string} userId
 * @returns {string} signed token
 */
const generateToken = (userId) => {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured. Set it in your .env file.');
  }
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 */
const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { generateToken, verifyToken };
