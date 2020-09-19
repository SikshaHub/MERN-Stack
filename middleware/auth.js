const jwt = require('jsonwebtoken');
const config = require('config');

/** Middleware function takes three params- req, res and next*/
module.exports = function (req, res, next) {
  /** Get Token from Header */
  const token = req.header('x-auth-token');

  /** Check if there is no token */
  if (!token) {
    return res.status(401).json({ msg: 'No Token, authorization denied' });
  }

  /** Verify Token */
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
