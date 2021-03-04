const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const decode = require('jwt-decode');
const { Message } = require('../models/Message');

const router = express.Router();
AWS.config.update({
  accessKeyId: 'AKIAI5ZM5TTMEUXIHZDA',
  secretAccessKey: '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',
});
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'p-connect',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});
router.post('/upload', upload.single('document'), function (req, res) {
  const token = req.header('x-auth');

  const body = {
    question: req.body.question,
    description: req.body.description,
    location: req.file.location,
    document: req.file.originalname,
    link: req.body.link,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    sender: req.body.sender,
  };
  const message = new Message(body);
  message
    .save()
    .then(function (message) {
      res.send(message);
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });

  // Message.findByIdAndUpdate(decode(token)._id, body, { new: true })
  //   .then(function () {
  //     res.sendStatus(200);
  //   })
  //   .catch(function (err) {
  //     res.send(err);
  //   });
});
