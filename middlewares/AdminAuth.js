const { Admin } = require('../models/Admin');
const authenticateLoginUser = function (req, res, next) {
  const email = req.body.email;
  Admin.findOne({ email })
    .then(function (admin) {
      if (admin.allowAccess) {
        console.log('Login user');
        next();
      } else {
        res.status('401').send({ notice: 'token not available' });
      }
    })
    .catch(function (err) {
      res.status('401').send(err);
    });
};
const authenticateAccess = function (req, res, next) {
  const email = req.body.email;
  console.log('Access');
  Admin.findOne({ email })

    .then(function (admin) {
      if (admin.allowAccess === false) {
        res.status('403').send({ notice: 'Access is not allowed' });
      } else {
        next();
      }
    })
    .catch(function (err) {
      res.send({ errors: 'Invalid email / password !' });
    });
};

const authenticateUser = function (req, res, next) {
  const token = req.header('x-auth');
  Admin.findByToken(token)

    .then(function (admin) {
      if (admin.allowAccess) {
        req.admin = admin;
        req.token = token;
        console.log('Authenticate user');
        next();
      } else {
        res.status('401').send({ notice: 'token not available' });
      }
    })
    .catch(function (err) {
      res.status('401').send(err);
    });
};

module.exports = {
  authenticateUser,
  authenticateLoginUser,
  authenticateAccess,
};
