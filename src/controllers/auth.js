require('dotenv').config();

const User = require('../models/auth');
const misc = require('../helper/misc');
const bcrypt = require('../helper/bcrypt');
const jwt = require('../helper/jwt');

module.exports = {
  register: async (req, res) => {
    const { email, password, role } = req.body;
    let defaultName = email;
    try {
      const user = await User.checkUser(email);
      if (user.length === 0) {
        const data = {
          name: defaultName.slice(0, defaultName.indexOf('@')),
          email,
          password,
          role: (role === 'admin' && 'admin') || 'Customer',
        };
        await User.register(data);

        misc.response(res, 200, false, 'Successfull register', data);
      } else {
        return misc.response(res, 400, true, 'User already exists');
      }
    } catch (error) {
      console.error(error.message);
      misc.response(res, 500, true, 'Server error');
    }
  },
  login: async (request, response) => {
    const { email, password } = request.body;

    try {
      const user = await User.login(email);
      console.log(user[0].password, ',', password);
      if (user.length === 0) {
        return response
          .status(400)
          .json({ errors: [{ msg: 'User not found in our database' }] });
      } else {
        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
          return response
            .status(400)
            .json({ errors: [{ msg: 'Password do not match' }] });
        } else {
          let token = jwt.sign({
            id: user[0].id,
            role: user[0].role,
            email: user[0].email,
          });
          misc.response(response, 200, false, 'Successfull login', token);
        }
      }
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, 'Server error');
    }
  },
  updateName: async (request, response) => {
    try {
      const id = request.params.id;
      let requireCheck = [];
      const { name } = request.body;
      !name ? requireCheck.push('name is required') : '';
      if (requireCheck.length) {
        return misc.response(response, 400, false, 'Not Valid', {
          errors: [{ msg: requireCheck }],
        });
      }

      await User.updateName(id, name);
      misc.response(response, 200, false, 'Success Update Name', name);
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, 'Server error');
    }
  },
};
