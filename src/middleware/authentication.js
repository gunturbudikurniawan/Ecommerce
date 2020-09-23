const jwt = require('../helper/jwt');
const User = require('../models/auth');

module.exports = async (req, res, next) => {
  try {
    let decoded = jwt.verify(req.headers.token);
    const user = await User.checkUser();

    if (user === decoded) {
      res.status(401).json({ message: 'not recognized input data' });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: 'not allowed to access', err });
  }
};
