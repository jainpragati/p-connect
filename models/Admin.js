const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
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
});
// // adminSchema.pre('save', function (next) {
// //   const admin = this;
// //   if (admin.isNew) {
// //     function encryptPassword() {
// //       return bcryptjs.genSalt(10).then(function (salt) {
// //         return bcryptjs
// //           .hash(admin.password, salt)
// //           .then(function (encryptedPassword) {
// //             admin.password = encryptedPassword;
// //           });
// //       });
// //     }

// //     function setRole() {
// //       return Admin.countDocuments().then(function (count) {
// //         if (count == 0) {
// //           admin.roles = 'admin';
// //         }
// //       });
// //     }

// //     return Promise.all([encryptPassword(), setRole()])
// //       .then(function (values) {
// //         next();
// //       })
// //       .catch(function (err) {
// //         return Promise.reject(err.message);
// //       });
// //   } else {
// //     next();
// //   }
// // });

// // own instance methods
// adminSchema.methods.generateToken = function () {
//   const admin = this;
//   const tokenData = {
//     _id: admin._id,
//     roles: admin.roles,
//   };

//   const token = jwt.sign(tokenData, 'jwt@123');
//   admin.tokens.push({
//     token,
//   });

//   return admin
//     .save()
//     .then(function (admin) {
//       return Promise.resolve(token);
//     })
//     .catch(function (err) {
//       return Promise.reject(err);
//     });
// };

// own static method
adminSchema.statics.findByCredentials = function (email, password) {
  const Admin = this;

  return Admin.findOne({ email })

    .then(function (admin) {
      if (!admin) {
        return Promise.reject({ errors: 'Invalid email / password' });
      }

      return bcryptjs.compare(password, admin.password).then(function (result) {
        if (result) {
          return Promise.resolve(admin);
        } else {
          return Promise.reject({ errors: 'Invalid email / password' });
        }
      });
    })
    .catch(function (err) {
      return Promise.reject(err);
    });
};

adminSchema.statics.findByToken = function (token) {
  const Admin = this;
  let tokenData;
  try {
    tokenData = jwt.verify(token, 'jwt@123');
  } catch (err) {
    return Promise.reject(err);
  }

  return Admin.findOne({ _id: tokenData._id, 'tokens.token': token });
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = {
  Admin,
};
