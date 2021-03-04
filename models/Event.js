const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 10,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: 'Not Answered',
  },
  rejectButton: {
    type: Boolean,
  },
  status: {
    type: String,
  },
  hour: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
  },
  acceptButton: {
    type: Boolean,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
  },

  inviter: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
  Event,
};
