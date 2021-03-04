const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  rating: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});
const Rating = mongoose.model('Rating', ratingSchema);
module.exports = {
  Rating,
};
