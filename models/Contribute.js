const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributeSchema = new Schema({
  // professionalId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    required: true,
    minlength: 6,
  },
  link: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
    minlength: 10,
    required: true,
  },
  document: {
    type: String,
  },
  counter: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  contributer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Contribute = mongoose.model('Contribute', contributeSchema);

module.exports = {
  Contribute,
};
