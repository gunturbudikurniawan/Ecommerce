const Product = require('../models/product');
const fs = require('fs-extra');
const misc = require('../helper/misc');

module.exports = {
  getAll: async (request, response) => {
    const page = parseInt(request.query.page) || 1;
    const search = request.query.search || '';
    const limit = request.query.limit || 10;
    const sort = request.query.sort || 'DESC';
    const category = request.query.category_id || 2;
    const sortBy = request.query.sortBy || 'date_updated';
    const offset = (page - 1) * limit;
    try {
      const total = await Product.getProductCount();
      const prevPage = page === 1 ? 1 : page - 1;
      const nextPage = page === total[0].total ? total[0].total : page + 1;
      const data = await Product.getAll(
        offset,
        limit,
        sort,
        sortBy,
        search,
        category
      );

      let pageDetail = {
        total: Math.ceil(total[0].total),
        per_page: limit,
        current_page: page,
        nextLink: `http://localhost:8001${request.originalUrl.replace(
          'page=' + page,
          'page=' + nextPage
        )}`,
        prevLink: `http://localhost:8001${request.originalUrl.replace(
          'page=' + page,
          'page=' + prevPage
        )}`,
      };

      misc.responsePagination(
        response,
        200,
        false,
        'Successfull get all data',
        pageDetail,
        data,
        request.originalUrl
      );
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server error');
    }
  },
  getSingleProduct: async (request, response) => {
    const product_id = request.params.product_id;

    try {
      const data = await Product.getSingleProduct(product_id);
      misc.response(
        response,
        200,
        false,
        'Successfull get single product',
        data[0],
        request.originalUrl
      );
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server error');
    }
  },
  addProduct: async (request, response) => {
    let error = false;
    if (request) {
      if (request.file) {
        if (request.file.size >= 5242880) {
          const message = 'Oops!, Size cannot more than 5MB';
          misc.response(response, 400, false, message);
          error = true;
          fs.unlink(`public/images/product/${request.file.filename}`, function (
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
          fs.unlink(`public/images/product/${request.file.filename}`, function (
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

    const name = request.body.name;
    const description = request.body.description;
    const stock = request.body.stock;
    const price = request.body.price;
    const category_id = request.body.category_id;
    const user_id = request.body.user_id;
    const photo = request.file.originalname;

    try {
      if (error === false) {
        const response_addProduct = await Product.addProduct(
          name,
          price,
          stock,
          description,
          category_id,
          user_id
        );
        const product_id = response_addProduct.insertId;
        await Product.addProductPhoto(product_id, photo);

        const data = {
          name,
          description,
          stock,
          price,
          category_id,
          user_id,
          product_id,
          photo,
        };
        misc.response(response, 200, false, 'Successfull create product', data);
      }
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server Error');
    }
  },
  updateProduct: async (request, response) => {
    let error = false;

    if (request) {
      if (request.file) {
        if (request.file.size >= 5242880) {
          const message = 'Oops!, Size cannot more than 5MB';
          response.json(message);
          error = true;
          fs.unlink(
            `public/images/products/${request.file.originalname}`,
            function (error) {
              if (error) response.json(error);
            }
          );
        }

        const file = request.file.originalname;
        const extension = file.split('.');
        const filename = extension[extension.length - 1];

        if (!isImage(filename)) {
          const message = 'Oops!, File allowed only JPG, JPEG, PNG, GIF, SVG';
          response.json(message);
          error = true;
          fs.unlink(
            `public/images/products/${request.file.originalname}`,
            function (error) {
              if (error) response.json(error);
            }
          );
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

    const product_id = request.body.product_id;

    const name = request.body.name;
    const description = request.body.description;
    const stock = request.body.stock;
    const price = request.body.price;
    const category_id = request.body.category_id;
    const user_id = request.body.user_id;
    const photo = request.file.originalname;

    try {
      if (error === false) {
        await Product.updateProduct(
          product_id,
          name,
          price,
          stock,
          description,
          category_id,
          user_id
        );
        await Product.updateProductPhoto(product_id, photo);

        const data = {
          name,
          description,
          stock,
          price,
          category_id,
          user_id,
          product_id,
          photo,
        };
        misc.response(response, 200, false, 'Successfull update product', data);
      }
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server Error');
    }
  },
  deleteProduct: async (request, response) => {
    const product_id = request.body.product_id;

    try {
      await Product.deleteProduct(product_id);
      misc.response(response, 200, false, 'Successfull delete product');
    } catch (error) {
      console.error(error);
      misc.response(response, 500, true, 'Server error');
    }
  },
};
