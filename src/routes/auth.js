const express = require('express');
const multer = require('multer');
const Auth = require('../controllers/auth');
const Route = express.Router();
const { validateUser, updatePhone } = require('../middleware/userValidator');
const authentication = require('../middleware/authentication');
const adminAuthor = require('../middleware/adminAuthor');
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, '../public/images/user');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

Route.post('/register', validateUser, Auth.register)
  .post('/login', Auth.login)
  .post('/update/:id', Auth.updateName)
  .post('/updatePhone/:id', authentication, updatePhone, Auth.updatePhone)
  .post('/updateLink_wa/:id', authentication, Auth.updateLink_wa)
  .post('/updateTTL/:id', authentication, Auth.updateTTL)
  .post('/updateGender/:id', authentication, Auth.updateGender)
  .post('/updatePhoto/:id', upload.single('photo'), Auth.addUserPhoto)
  .delete('/deleteUser/:id', adminAuthor, Auth.deleteUser);

module.exports = Route;
