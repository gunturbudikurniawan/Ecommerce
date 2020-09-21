const connection = require('../configs/connection');

module.exports = {
  createUser: (name) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO user SET ?', name, (error, result) => {
        if (!error) {
          const goodResponse = {
            id: result.insertId,
            ...data,
          };
          delete goodResponse.password;
          resolve(goodResponse);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
};
