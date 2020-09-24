require('dotenv').config();
const User = require('../models/auth');
const nodemailer = require('nodemailer');
const fs = require('fs-extra');
const misc = require('../helper/misc');
const bcrypt = require('../helper/bcrypt');
const jwt = require('../helper/jwt');
const connection = require('../configs/connection');

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
          role,
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
  uploadUser: async (request, response, next) => {
    let error = false;
    if (request) {
      if (request.file) {
        if (request.file.size >= 5242880) {
          const message = 'Oops!, Size cannot more than 5MB';
          misc.response(response, 400, false, message);
          error = true;
          fs.unlink(`public/images/profile/${request.file.filename}`, function (
            error
          ) {
            if (error) misc.response(response, 400, false, error);
          });
        }
        const file = request.file.filename;
        const extension = file.split('.');
        const filename = extension[extension.length - 1];

        if (!isImage(filename)) {
          const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG';
          misc.response(response, 400, false, message);
          error = true;
          fs.unlink(`public/images/profile/${request.file.filename}`, function (
            error
          ) {
            if (error) misc.response(response, 400, false, error);
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
    const id = request.params.id;
    const photo = request.file.filename;
    try {
      if (error === false) {
        await User.uploadUser(photo, id);
        misc.response(response, 200, false, 'Success upload profile User');
      }
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server error');
    }
  },
  getAllNotAdmin: async (request, response) => {
    const page = parseInt(request.query.page) || 1;
    const search = request.query.search || '';
    const limit = request.query.limit || 10;
    const sort = request.query.sort || 'DESC';
    const sortBy = request.query.sortBy || ' 	date_updated';
    const offset = (page - 1) * limit;
    let totalNotAdmin = 0;
    let totalPage = 0;
    let prevPage = 0;
    let nextPage = 0;
    connection.query(
      `SELECT COUNT(*) as data FROM user WHERE (phone LIKE '%${search}' or name LIKE '%${search}' )`,
      (error, response) => {
        if (error) {
          misc.response(response, 400, true, 'Error', error);
        }
        totalNotAdmin = response[0].data;
        totalPage =
          totalNotAdmin % limit === 0
            ? totalNotAdmin / limit
            : Math.floor(totalNotAdmin / limit + 1);
        prevPage = page === 1 ? 1 : page - 1;
        nextPage = page === totalPage ? totalPage : page + 1;
      }
    );
    User.getAll(offset, limit, sort, sortBy, search)
      .then((result) => {
        const data = {
          status: 200,
          error: false,
          source: 'api',
          data: result,
          total_data: Math.ceil(totalNotAdmin),
          per_page: limit,
          current_page: page,
          total_page: totalPage,
          nextLink: `http://localhost:8001${request.originalUrl.replace(
            'page=' + page,
            'page=' + nextPage
          )}`,
          prevLink: `http://localhost:8001${request.originalUrl.replace(
            'page=' + page,
            'page=' + prevPage
          )}`,
          message: 'Success getting all data',
        };
        response.status(200).json({
          status: 200,
          error: false,
          source: 'api',
          data: result,
          total_data: Math.ceil(totalNotAdmin),
          per_page: limit,
          current_page: page,
          total_page: totalPage,
          nextLink: `http://localhost:8001${request.originalUrl.replace(
            'page=' + page,
            'page=' + nextPage
          )}`,
          prevLink: `http://localhost:8001${request.originalUrl.replace(
            'page=' + page,
            'page=' + prevPage
          )}`,
          message: 'Success getting all data',
        });
      })
      .catch((err) => {
        console.log(err);
        response.status(400).json({
          status: 400,
          error: true,
          message: 'Data not Found',
        });
      });
  },
  getAllNotAdminbyId: (request, response) => {
    const id = request.params.id;
    User.getAllNotAdmin(id)
      .then((result) => {
        response.status(200).json({
          status: 200,
          error: false,
          dataShowed: result.length,
          data: result,
          response: 'Data loaded',
        });
      })
      .catch((err) => {
        console.log(err);
        response.status(400).json({
          status: 400,
          error: true,
          message: 'Failed to get User with this Id',
          detail: err.message,
        });
      });
  },
  forgotPassword: async (request, response) => {
    let error = false;

    const email = request.body.email;

    const getOTP = () => {
      return Math.floor(1000 + Math.random() * 9000);
    };

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: process.env.USER_MAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });

    try {
      const checkUser = await User.checkUser(email);

      if (checkUser.length === 0) {
        error = true;
        misc.response(response, 500, true, 'Oops!, email not exists');
      }

      if (error === false) {
        await User.updateOTP(email, getOTP());
        const getDBOTP = await User.getDBOTP(email);

        await transporter.sendMail({
          from: 'Ecommerce Admin <Ecommercesandbox@gmail.com>',
          to: email,
          subject: 'Reset Password',
          html: `Untuk merubah password, silahkan masukan kode OTP dibawah ini. <br><b>${getDBOTP[0].OTP}</b>`,
        });

        misc.response(response, 200, false, 'Successfull email sent');
      }
    } catch (err) {
      error = true;
      console.error(err);
      misc.response(response, 500, true, 'Server error');
    }
  },

  updatePassword: async (request, response) => {
    let error = false;

    const email = request.body.email;
    const OTP = request.body.OTP;
    const password = request.body.password;
    const password_confirmation = request.body.password_confirmation;

    try {
      if (password !== password_confirmation) {
        error = true;
        throw new Error('Oops!, password do not match');
      }

      const checkDB = await User.checkUser(email);

      if (checkDB.length === 0) {
        error = true;
        throw new Error('Oops!, email not exists');
      } else {
        if (parseInt(OTP) !== checkDB[0].OTP || email !== checkDB[0].email) {
          error = true;
          throw new Error('Oops!, invalid email or otp');
        }
      }

      if (error === false) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        await User.updatePassword(passwordHash, email);
        await User.updateOTPToNull(email);
        misc.response(response, 200, false, 'Successfull update password');
      }
    } catch (error) {
      console.error(error.message);
      misc.response(response, 500, true, `${error.message}`);
    }
  },
  profileNewPassword: async (request, response) => {
    let error = false;

    const email = request.body.email;
    const old_password = request.body.old_password;
    const new_password = request.body.new_password;

    try {
      const db_password = await User.checkUser(email);

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(new_password, salt);

      const checkOldPassword = await bcrypt.compare(
        new_password,
        db_password[0].password
      );

      if (checkOldPassword === true) {
        error = true;
        throw new Error('Oops, Password cannot same with old password');
      }

      if (error === false) {
        await User.updatePassword(passwordHash, email);
        misc.response(
          response,
          200,
          false,
          'Successfull update password profile'
        );
      }
    } catch (error) {
      misc.response(response, 500, true, `${error.message}`);
    }
  },
};
