const express = require('express');
const multer = require('multer');
const Auth = require('../controllers/auth');
const Route = express.Router();
const { validateUser, updatePhone } = require('../middleware/userValidator');
const authentication = require('../middleware/authentication');
const adminAuthor = require('../middleware/adminAuthor');

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, './public');
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});
const uploadUser = multer({
  storage,
});

Route.post('/register', validateUser, Auth.register)
  .post('/login', Auth.login)
  .post('/update/:id', Auth.updateName)
  .post('/updatePhone/:id', authentication, updatePhone, Auth.updatePhone)
  .post('/updateLink_wa/:id', authentication, Auth.updateLink_wa)
  .post('/updateTTL/:id', authentication, Auth.updateTTL)
  .post('/updateGender/:id', authentication, Auth.updateGender)
  .patch(
    '/updatePhoto/:id',
    authentication,
    uploadUser.single('photo'),
    Auth.uploadUser
  )
  .get('/getAllNotAdmin', Auth.getAllNotAdmin)
  .get('/getAllNotAdminbyId/:id', Auth.getAllNotAdminbyId)
  .delete('/deleteUser/:id', adminAuthor, Auth.deleteUser)
  .post('/forgot-password', Auth.forgotPassword)
  .patch('/update-password', Auth.updatePassword)
  .patch('/profile-change-password', Auth.profileNewPassword);

module.exports = Route;
