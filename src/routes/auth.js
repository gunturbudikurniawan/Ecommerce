const express = require('express');
const Route = express.Router();

const { createUser } = require('../controllers/auth');

Route.post('/register', createUser);

module.exports = Route;
