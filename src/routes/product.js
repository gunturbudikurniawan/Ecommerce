const express = require('express');
const multer = require('multer');
const Product = require('../controllers/product');
const Route = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, './public/product');
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});
const uploadProduct = multer({
  storage,
});

Route.get('/', Product.getAll)
  .get('/show-product/:product_id', Product.getSingleProduct)
  .post('/', uploadProduct.single('photo'), Product.addProduct)
  .patch('/update', uploadProduct.single('photo'), Product.updateProduct)
  .delete('/:product_id/delete', Product.deleteProduct);

module.exports = Route;
