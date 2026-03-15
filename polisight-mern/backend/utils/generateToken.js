const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for the given user id.
 * @param {string} id  Mongoose _id
 * @returns {string}   Signed JWT string
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
