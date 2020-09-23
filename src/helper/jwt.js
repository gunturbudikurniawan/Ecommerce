const jwt = require('jsonwebtoken');

module.exports = {
  verify: function (token) {
    return jwt.verify(token, process.env.JWT_KEY);
  },
  sign: function (obj) {
    return jwt.sign(obj, process.env.JWT_KEY);
  },
};
