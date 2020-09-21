const { createUser } = require('../models/auth');
const helper = require('../helpers/misc');

module.exports = {
  createUser: (request, response) => {
    console.log(request.body);
  },
};
