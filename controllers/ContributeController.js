const express = require('express');

// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const decode = require('jwt-decode');
const { Contribute } = require('../models/Contribute');

const router = express.Router();

// AWS.config.update({
//   accessKeyId: 'AKIAI5ZM5TTMEUXIHZDA',
//   secretAccessKey: '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',
// });

// const s3 = new AWS.S3();
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'p-connect',
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

router.post('/upload', function (req, res) {
  const token = req.header('x-auth');

  const body = {
    title: req.body.title,

    link: req.body.link,
    // location: req.file.location,
    // document: req.file.originalname,
    description: req.body.description,
    contributer: req.body.contributer,
  };
  const contribute = new Contribute(body);
  contribute
    .save()
    .then(function (contribute) {
      res.send(contribute);
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

router.post('/register/:id', function (req, res) {
  Contribute.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { counter: 1, amount: 0.5 } },
    // { $inc: { amount: 1 } },
    { new: true }
  )
    .then((counter) => res.send(counter))
    //.then((amount) => res.send(amount))
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

router.post('/get', function (req, res) {
  Contribute.findOne({ title: req.body.title })
    .then((titles) => res.json(titles))
    .catch((err) => err.status(400).json('Error ' + err));
});

router.get('/', function (req, res) {
  Contribute.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'contributer',
      populate: { path: 'rating', model: 'Rating' },
    })
    .then(function (contributes) {
      res.send(contributes);

      // res.send(contributes.contributer);
      // console.log('My', contributes.contributer);
    })
    .catch(function (err) {
      res.send(err);
    });
});
// router.get('/feed/:id', function (req, res) {
//   Contribute.find()
//     .then(function (contributes) {
//       res.send(contributes);
//     })
//     .catch(function (err) {
//       res.send(err);
//     });
// });

router.get('/myfeed/:userId', function (req, res) {
  console.log(req.params.userId);

  Contribute.find({ contributer: req.params.userId })
    .sort({ createdAt: -1 })
    .then((contribute) => {
      // console.log(user.event);

      console.log(contribute);
      res.send(contribute);
    });
});
router.delete('/delete/:_id', function (req, res) {
  const id = req.body.params;
  Contribute.deleteOne(id)
    .then(function (contribute) {
      res.send(contribute);
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = {
  contributeRouter: router,
};
