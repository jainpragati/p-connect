const express = require('express');
const router = express.Router();
const { contributeRouter } = require('../controllers/ContributeController');
const { usersRouter } = require('../controllers/UserController');
const { aboutRouter } = require('../controllers/AboutController');
const { eventRouter } = require('../controllers/EventController');
const { messageRouter } = require('../controllers/MessageController');
const { ratingRouter } = require('../controllers/RatingController');
const { paymentRouter } = require('../controllers/StripeController');
const { commentRouter } = require('../controllers/CommentController');
const { adminRouter } = require('../controllers/AdminController');
router.use('/api/admin', adminRouter);
router.use('/api/comment', commentRouter);
router.use('/api/contribute', contributeRouter);
router.use('/api/users', usersRouter);
router.use('/api/about', aboutRouter);
router.use('/api/event', eventRouter);
router.use('/api/message', messageRouter);
router.use('/api/rating', ratingRouter);
router.use('/api/payment', paymentRouter);

module.exports = {
  router,
};
