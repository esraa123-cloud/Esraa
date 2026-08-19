/**
 * Simple in-memory blacklist for revoked JWTs (used on logout).
 * NOTE: this resets when the server restarts and does not scale across
 * multiple server instances. For production, replace with a Redis-backed
 * store keyed by token (or jti) with a TTL matching the token expiry.
 */
const blacklist = new Set();

const revokeToken = (token) => {
  blacklist.add(token);
};

const isRevoked = (token) => blacklist.has(token);

module.exports = { revokeToken, isRevoked };
