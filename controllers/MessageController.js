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
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    link: req.body.link,
    location: req.file.location,
    document: req.file.originalname,
    description: req.body.description,
    sender: req.body.sender,
  };
  const message = new Message(body);
  message
    .save()
    .then(function (message) {
      res.send({ messageId: message._id });
      console.log(messageId);
      // res.send(message);
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});
router.post('/register', function (req, res) {
  const body = req.body;
  console.log('Message', req.body);
  const message = new Message(body);
  message
    .save()

    .then(function (message) {
      res.send({ messageId: message._id });
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});
router.get('/myquery/:userId', function (req, res) {
  // console.log(req.params.userId);
  Message.find({ sender: req.params.userId })
    // .populate('user')
    .then((message) => {
      console.log('My message', message);
      res.send(message);
    });
});

router.get('/', function (req, res) {
  Message.find()
    .populate('messageSender')
    .then(function (messages) {
      res.send(messages);
      res.send(messages.messageSender);
    })

    .catch(function (err) {
      res.send(err);
    });
});

router.delete('/delete/:id', function (req, res) {
  const id = req.body.params;
  Message.deleteOne(id)
    .then(function (message) {
      res.send(message);
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = {
  messageRouter: router,
};
