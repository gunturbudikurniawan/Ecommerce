const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
  compare: function (pass, hash) {
    return bcrypt.compareSync(pass, hash);
  },
  hash: function (pass) {
    return bcrypt.hashSync(pass, salt);
  },
};
