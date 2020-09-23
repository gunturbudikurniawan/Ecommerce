const express = require('express');
const Auth = require('../controllers/auth');
const Route = express.Router();
const { validateUser } = require('../middleware/userValidator');

Route.post('/register', validateUser, Auth.register)
  .post('/login', Auth.login)
  .post('/update/:id', Auth.updateName);

module.exports = Route;
