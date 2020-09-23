require('dotenv').config();
const User = require('../models/auth');
const fs = require('fs-extra');
const misc = require('../helper/misc');
const bcrypt = require('../helper/bcrypt');
const jwt = require('../helper/jwt');

module.exports = {
  register: async (req, res) => {
    const { email, password, role } = req.body;
    let defaultName = email;
    try {
      const user = await User.checkUser(email);
      const passwordHash = await bcrypt.hash(password);
      if (user.length === 0) {
        const data = {
          name: defaultName.slice(0, defaultName.indexOf('@')),
          email,
          password: passwordHash,
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
          const token = jwt.sign({
            id: user[0].id,
            role: user[0].role,
            email: user[0].email,
          });
          const data = { token, role: user[0].role, email: user[0].email };
          misc.response(response, 200, false, 'Successfull login', data);
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
  updatePhone: async (request, response) => {
    try {
      const id = request.params.id;
      let requireCheck = [];
      const { phone } = request.body;
      !phone ? requireCheck.push('Phone is required') : '';
      if (requireCheck.length) {
        return misc.response(response, 400, false, 'Not Valid', {
          errors: [{ msg: requireCheck }],
        });
      }

      await User.updatePhone(id, phone);
      misc.response(response, 200, false, 'Success Update Phone', phone);
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, 'Server error');
    }
  },
  updateLink_wa: async (request, response) => {
    try {
      const id = request.params.id;
      let requireCheck = [];
      const { link_wa } = request.body;
      !link_wa ? requireCheck.push('Link Wa is required') : '';
      if (requireCheck.length) {
        return misc.response(response, 400, false, 'Not Valid', {
          errors: [{ msg: requireCheck }],
        });
      }

      await User.updateLink_wa(id, link_wa);
      misc.response(
        response,
        200,
        false,
        'Success Update Link Whatsapp',
        link_wa
      );
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, 'Server error');
    }
  },
  updateTTL: async (request, response) => {
    try {
      const id = request.params.id;
      let requireCheck = [];
      const { ttl } = request.body;
      !ttl ? requireCheck.push('Tempat Tanggal Lahir is required') : '';
      if (requireCheck.length) {
        return misc.response(response, 400, false, 'Not Valid', {
          errors: [{ msg: requireCheck }],
        });
      }

      await User.updateTTL(id, ttl);
      misc.response(
        response,
        200,
        false,
        'Success Update Tempat Tanggal Lahir',
        ttl
      );
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, 'Server error');
    }
  },
  updateGender: async (request, response) => {
    try {
      const id = request.params.id;
      let requireCheck = [];
      const { gender } = request.body;
      gender === 'Laki-laki' || 'Perempuan';
      !gender ? requireCheck.push('Gender is required') : '';
      if (requireCheck.length) {
        return misc.response(response, 400, false, 'Not Valid', {
          errors: [{ msg: requireCheck }],
        });
      }

      await User.updateGender(id, gender);
      misc.response(response, 200, false, 'Success Update Gender', gender);
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, 'Server error');
    }
  },
  deleteUser: async (request, response) => {
    const id = request.params.id;

    try {
      await User.deleteUser(id);
      misc.response(response, 200, false, 'Successfull delete User');
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server error');
    }
  },
  addUserPhoto: async (req, res) => {
    let error = false;

    if (req) {
      if (req.file) {
        if (req.file.size >= 5242880) {
          const message = 'Oops!, Size cannot more than 5MB';
          response.json(message);
          error = true;
          fs.unlink(`../public/images/user/${req.file.originalname}`, function (
            error
          ) {
            if (error) response.json(error);
          });
        }

        const file = req.file.originalname;
        const extension = file.split('.');
        const filename = extension[extension.length - 1];

        if (!isImage(filename)) {
          const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG';
          response.json(message);
          error = true;
          fs.unlink(`../public/images/user/${req.file.originalname}`, function (
            error
          ) {
            if (error) response.json(error);
          });
        }

        function isImage(filename) {
          switch (filename) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'svg':
              return true;
          }
          return false;
        }
      }
    }
    const photo = req.file.originalname;
    const id = req.params.id;
    try {
      if (error === false) {
        await User.addUserPhoto(id, photo);
        misc.response(res, 200, false, 'Successfull update photo', photo);
      }
    } catch (error) {
      console.error(error);
      misc.response(res, 500, true, 'Server Error');
    }
  },
};
