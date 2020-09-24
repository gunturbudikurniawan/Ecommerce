const connection = require('../configs/connection');

module.exports = {
  getProductCount: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) total from products`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  getAll: (offset, limit, sort, sortBy, search, category) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.*, b.*
        FROM products a, photo_product b, category c
        WHERE a.name LIKE '%${search}%'
        AND a.id = b.product_id
        AND a.category_id = '${category}'
        AND c.id = '${category}'
        ORDER BY a.${sortBy} ${sort} LIMIT ${offset}, ${limit}`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  addProduct: (name, price, stock, description, category_id, user_id) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO products (name, price, stock, description, category_id, user_id)
        VALUES ('${name}', '${price}', '${stock}', '${description}', '${category_id}', '${user_id}')`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  addProductPhoto: (product_id, photo) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO photo_product (photo, product_id)
                        VALUES ('${photo}', '${product_id}')`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateProduct: (
    product_id,
    name,
    price,
    stock,
    description,
    category_id,
    user_id
  ) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE products SET
        name = '${name}',
        price = '${price}',
        stock = '${stock}',
        description = '${description}',
        category_id = '${category_id}',
        user_id = '${user_id}'
        WHERE id = '${product_id}'`;

      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateProductPhoto: (product_id, photo) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE photo_product SET photo = '${photo}' WHERE product_id = '${product_id}'`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  getSingleProduct: (product_id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT a.id product_id, a.name, a.price, a.stock, a.description, b.* FROM products a INNER JOIN photo_product b ON b.product_id = a.id WHERE a.id = '${product_id}'`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  deleteProduct: (product_id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM products WHERE id = '${product_id}'`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
};
