const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const eventSchema = require('./Event');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  address: {
    type: String,
    minlength: 3,
  },
  bio: {
    trim: true,
    type: String,
  },
  profession: {
    type: String,
  },
  otherStream: {
    type: String,
    minlength: 3,
  },
  underGraduate: {
    type: String,
  },
  underGraduateCollege: {
    type: String,
  },
  postGraduate: {
    type: String,
  },
  postGraduateCollege: {
    type: String,
  },
  workPlace: {
    type: String,
  },
  interest: {
    type: String,
  },
  teaching: {
    type: String,
  },
  working: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },
  stream: {
    type: String,
  },
  experience: {
    type: Number,
  },
  city: {
    type: String,
  },
  location: {
    type: String,
  },
  certificate: {
    type: String,
  },
  session: {
    type: String,
  },
  specialization: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  repeatPassword: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
  },

  email: {
    type: String,
    required: true,

    trim: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: function () {
        return 'Invalid email format';
      },
    },
  },
  payment_email: { type: String },

  amount: { type: Number, default: 500 },
  subscriptionDeadLine: {
    type: Date,
    default: new Date(+new Date() + 10 * 60 * 1000),
  },
  roles: {
    type: String,
    default: 'user',
  },
  notice: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  //  invitations: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  // follow: [{ type: Schema.Types.ObjectId }],
  document: [
    {
      title: {
        type: String,
      },
      doc: {
        type: String,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  allowAccess: {
    type: Boolean,
    default: true,
  },
  rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  ratingGiver: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  event: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  message: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  query: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  contributeId: [{ type: Schema.Types.ObjectId, ref: 'Contribute' }],
  comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

// pre hooks - Model Middlewares -
userSchema.pre('save', function (next) {
  const user = this;
  if (user.isNew) {
    function encryptPassword() {
      return bcryptjs.genSalt(10).then(function (salt) {
        return bcryptjs
          .hash(user.password, salt)
          .then(function (encryptedPassword) {
            user.password = encryptedPassword;
          });
      });
    }

    function setRole() {
      return User.countDocuments().then(function (count) {
        if (count == 0) {
          user.roles = 'user';
        }
      });
    }

    return Promise.all([encryptPassword(), setRole()])
      .then(function (values) {
        next();
      })
      .catch(function (err) {
        return Promise.reject(err.message);
      });
  } else {
    next();
  }
});

// own instance methods
userSchema.methods.generateToken = function () {
  const user = this;
  const tokenData = {
    _id: user._id,
    roles: user.roles,
    amountPaid: user.amount,

    createdAt: Number(new Date()),
  };

  const token = jwt.sign(tokenData, 'jwt@123');
  user.tokens.push({
    token,
  });

  return user
    .save()
    .then(function (user) {
      return Promise.resolve(token);
    })
    .catch(function (err) {
      return Promise.reject(err);
    });
};

// own static method
userSchema.statics.findByCredentials = function (email, password) {
  const User = this;
  return User.findOne({ email })
    .then(function (user) {
      if (!user) {
        return Promise.reject({ errors: 'Invalid email / password' });
      }

      return bcryptjs.compare(password, user.password).then(function (result) {
        if (result) {
          return Promise.resolve(user);
        } else {
          return Promise.reject({ errors: 'Invalid email / password' });
        }
      });
    })
    .catch(function (err) {
      return Promise.reject(err);
    });
};

userSchema.statics.findByToken = function (token) {
  const User = this;
  let tokenData;
  try {
    tokenData = jwt.verify(token, 'jwt@123');
  } catch (err) {
    return Promise.reject(err);
  }

  return User.findOne({ _id: tokenData._id, 'tokens.token': token });
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
