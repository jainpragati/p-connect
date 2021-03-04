const express = require('express');
const { About } = require('../models/About');

const router = express.Router();

router.post('/register', function (req, res) {
  const body = req.body;
  const about = new About(body);
  about
    .save()
    .then(function (about) {
      res.send(about);
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.get('/', function (req, res) {
  About.find()
    .then(function (about) {
      res.send(about);
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.delete('/delete/:id', function (req, res) {
  const id = req.params.id;
  About.findByIdAndDelete(id)
    .then(function (about) {
      res.send(about);
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = {
  aboutRouter: router,
};
