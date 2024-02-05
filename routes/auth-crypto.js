// auth-crypto.js
// This is a module file that contains the code for the auth-crypto-check middleware.

const { Auth } = require("./common.js");

const authCryptoCheck = (req, res, next) => {
  if (req.session?.userID) {
    // If userID exists in session(= user is logged in)
    if (Date.now() - 1000 * 60 > req.session.hash_created_at) {
      // If hash_created_at is more than 1 minute ago, re-new hash
      Auth.getUserById(req.session.userID, (err, user) => {
        if (req.session.hash != user.hash) {
          // Clear session data if hash is not correct
          req.session.userID = null;
          req.session.hash = null;
          req.session.hash_created_at = null;
          req.session.verificationCode = null;
          req.session.verificationCodeExpiration = null;
          req.session.save();
          next();
        } else {
          // Re-new hash_created_at
          req.session.hash_created_at = Date.now();
          next();
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = authCryptoCheck;
