const { User } = require('../models/User');

const authenticateLoginUser = function (req, res, next) {
  const email = req.body.email;
  User.findOne({ email })
    .then(function (user) {
      if (user.allowAccess) {
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
  User.findOne({ email })
    .then(function (user) {
      if (user.allowAccess === false) {
        res.status('403').send({ notice: 'Access is not allowed' });
      } else {
        next();
      }
    })
    .catch(function (err) {
      res.send({ errors: 'Invalid email / password !' });
    });
};

const authenticateSubscription = function (req, res, next) {
  const email = req.body.email;
  User.findOne({ email })
    .then(function (user) {
      if (user.roles === 'user') {
        if (Date.parse(user.subscriptionDeadLine) > Date.now()) {
          console.log('Haa');
          next();
        } else {
          console.log('Naa');
          user.amount = 0;
          user.save();
          next();
        }
      } else {
        next();
      }
    })
    .catch(function (err) {
      res.status('403').send(err);
    });
};

const authenticateUser = function (req, res, next) {
  const token = req.header('x-auth');
  User.findByToken(token)
    .then(function (user) {
      if (user.allowAccess) {
        req.user = user;
        req.token = token;

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
  authenticateSubscription,
};
