const express = require('express');
const { authenticateAccess } = require('../middlewares/AdminAuth');
const router = express.Router();
const { Admin } = require('../models/Admin');
const { authenticateUser } = require('../middlewares/AdminAuth');

router.post('/login', authenticateAccess, function (req, res) {
  const body = req.body;
  console.log('my login');
  Admin.findByCredentials(body.email, body.password)

    .then(function (admin) {
      return admin.generateToken();
    })

    .then(function (token) {
      // res.setHeader('x-auth', token).send({}) Use this with postman
      console.log('this is token', token);
      res.setHeader('x-auth', token);
      res.send({ token }); //use this for react frontend to store token in localstorage
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.delete('/logoutALL', authenticateUser, function (req, res) {
  const { admin } = req;
  Admin.findByIdAndUpdate(admin._id, { $set: { tokens: [] } })
    .then(function () {
      res.send(admin);
    })
    .catch(function (err) {
      res.send(err);
    });
});
module.exports = {
  adminRouter: router,
};
