const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { Event } = require('../models/Event');

const router = express.Router();

router.post('/register', function (req, res) {
  const body = req.body;

  const event = new Event(body);
  event
    .save()
    .then(function (event) {
      res.send({ eventId: event._id });
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

router.get('/', function (req, res) {
  Event.find()
    .sort({ createdAt: -1 })
    .then(function (events) {
      res.send(events);
    })

    .catch(function (err) {
      res.send(err);
    });
});
router.get('/myinvite/:userId', function (req, res) {
  console.log(req.params.userId);

  Event.find({ mentorId: req.params.userId })
    .sort({ createdAt: -1 })
    .then((event) => {
      // console.log(user.event);

      console.log(event);
      res.send(event);
    });
});
router.put('/accept', function (req, res) {
  const body = res.body;
  // const id = req.header('userId');
  console.log('My id', req.body.eventId);

  Event.findByIdAndUpdate(
    req.body.eventId,
    { message: req.body.message, buttonState: req.body.buttonState },
    { new: true }
  )
    .then(function (event) {
      res.send(event);
    })

    .catch(function (err) {
      res.send(err);
    });
});
router.delete('/delete/:id', function (req, res) {
  const id = req.body.params;
  Event.deleteOne(id)
    .then(function (event) {
      res.send(event);
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = {
  eventRouter: router,
};
