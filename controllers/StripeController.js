require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.REACT_APP_KEY);
// const stripe = require('stripe')('sk_test_lZDIt2wfaoca9NXIsWAJOIuF00hVEYqZaV');
const { User } = require('../models/User');

const uuid = require('uuid');
const router = express.Router();

router.post('/pay', (req, res) => {
  const userId = req.header('userId');

  console.log(userId);
  console.log('Stripe Details', req.body);

  stripe.charges

    .create({
      amount: 500 * 100,

      currency: 'inr',
      description: 'Subscription',

      source: req.body.id,
    })
    .then((paymentDetail) => {
      console.log('PaymentRetail', paymentDetail);
      User.findByIdAndUpdate(
        userId,
        { $set: { amount: 500, subscriptionDeadLine: Date.now() } },
        { new: true }
      )
        .then((user) => {
          res.send(user);
        })
        .then((err) => {
          console.log(err);
        });
    });
});

module.exports = {
  paymentRouter: router,
};
