const express = require('express');
const { Comment } = require('../models/Comment');
const router = express.Router();
router.post('/register', function (req, res) {
  const body = req.body;
  console.log('Comment', req.body);
  const comment = new Comment(body);
  comment
    .save()

    .then(function (comment) {
      res.send({ commentId: comment._id });
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});
module.exports = {
  commentRouter: router,
};
