const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  comment: {
    type: String,
    trim: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  commentSender: { type: Schema.Types.ObjectId, ref: 'User' },
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = {
  Comment,
};
