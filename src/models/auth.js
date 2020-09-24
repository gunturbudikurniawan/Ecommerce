const connection = require('../configs/connection');

module.exports = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO user SET ?', data, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  login: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE email = ?`,
        email,
        (error, result) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  checkUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT email, password, OTP FROM user WHERE email = '${email}'`,
        (error, result) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  updateName: (id, name) => {
    let query = `UPDATE  user  SET  name = '${name}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateGender: (id, gender) => {
    let query = `UPDATE  user  SET  gender = '${gender}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateTTL: (id, ttl) => {
    let query = `UPDATE  user  SET  ttl = '${ttl}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updatePhone: (id, phone) => {
    let query = `UPDATE  user  SET  phone = '${phone}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  updateLink_wa: (id, link_wa) => {
    let query = `UPDATE  user  SET  link_wa = '${link_wa}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM user WHERE id = '${id}'`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  uploadUser: (filename, id) => {
    let query = `UPDATE user SET photo = '${filename}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  getAllNotAdmin: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE id = ${id} AND role != "admin"`,
        (error, result) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  getAll: (offset, limit, sort, sortBy, search) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM user WHERE role != "admin" AND (phone LIKE '%${search}%' or name LIKE '%${search}%') 
      ORDER BY ${sortBy} ${sort} LIMIT ${offset}, ${limit}`;
      connection.query(query, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });
    });
  },
  getDBOTP: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT OTP FROM user WHERE email = '${email}'`,
        (error, result) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  updateOTP: (email, OTP) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET OTP = '${OTP}' WHERE email = '${email}'`,
        (error, result) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  updateOTPToNull: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET OTP = NULL WHERE email = '${email}'`,
        (error, result) => {
          if (error) {
            reject(new Error(error));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  updatePassword: (passwordHash, email) => {
    return new Promise((resolve, reject) => {
      query = `UPDATE user SET password = '${passwordHash}' WHERE email = '${email}'`;
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
