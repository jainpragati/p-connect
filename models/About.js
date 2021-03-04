const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 6,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    minlength: 10,
    required: true,
  },
  message: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const About = mongoose.model('about', aboutSchema);

module.exports = {
  About,
};
