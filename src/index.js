const express = require('express');
const auth = require('./routes/auth');
const product = require('./routes/product');
const Route = express.Router();

Route.use('/api/v1/auth', auth).use('/api/v1/product', product);

module.exports = Route;
