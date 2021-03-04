const express = require('express');
const { Rating } = require('../models/Rating');
const { User } = require('../models/User');

const router = express.Router();
router.post('/register', function (req, res) {
  const body = req.body;
  console.log('rating', req.body);
  console.log('my user Id', req.body.user);
  const rating = new Rating(body);

  Rating.findOneAndUpdate(
    {
      $and: [{ mentorId: req.body.mentorId }, { user: req.body.user }],
    },
    {
      rating: req.body.rating,
      user: req.body.user,
      mentorId: req.body.mentorId,
    },
    { upsert: true }
  )

    .then(function (rating) {
      User.findOneAndUpdate(
        { _id: req.body.mentorId },
        {
          $addToSet: { rating: rating._id },
        },
        { upsert: true }
      ).then((user) => {
        console.log(user);
      });
      res.send({ rating });
    })
    .catch(function (err) {
      res.send(err);
    });
  console.log(rating);
});
//   rating
//     .save()
//     .then(function (rating) {
//       User.findByIdAndUpdate(req.body.mentorId, {
//         $push: { rating: rating._id },
//       }).then((user) => {
//         console.log(user);
//       });
//       res.send({ rating });
//     })

//     .catch(function (err) {
//       console.log(err);
//       res.send(err);
//     });
// });

router.get('/fetchrating/:ratingGiver/:ratingReciever', function (req, res) {
  console.log('RG', req.params.ratingGiver);
  console.log('RR', req.params.ratingReciever);
  Rating.findOne({
    user: req.params.ratingGiver,
    mentorId: req.params.ratingReciever,
  })
    .sort({ createdAt: -1 })
    .then(function (rating) {
      console.log(rating);
      res.send(rating);
    })

    .catch(function (err) {
      res.send(err);
    });
});
router.get('/', function (req, res) {
  Rating.find()
    .sort({ createdAt: -1 })
    // .populate('mentorId')
    .populate({
      path: 'mentorId',
      populate: { path: 'rating', model: 'Rating' },
    })
    .then(function (ratings) {
      res.send(ratings);
      console.log(ratings.user);
      res.send(ratings.user);
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.get('/myrating', function (req, res) {
  Rating.find({}).then((ratings) => res.send(ratings));
});
router.get('/rating1/:id', function (req, res) {
  console.log(req.params.id);
  User.findById(req.params.id).then((rating) => {
    console.log(rating);
    res.send(rating);
  });
});
module.exports = {
  ratingRouter: router,
};
