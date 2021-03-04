const express = require('express');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const AWS = require('aws-sdk');
require('dotenv').config();
const multer = require('multer');
const uploadLocation = require('../../client/src/uploads/uploadsLocation');
const multerS3 = require('multer-s3');
const { authenticateAccess } = require('../middlewares/authentication');
const decode = require('jwt-decode');
// const decode = require('jwt-decode');
const router = express.Router();
const { User } = require('../models/User');
const {
  authenticateUser,
  authenticateSubscription,
} = require('../middlewares/authentication');

// AWS.config.update({
//   accessKeyId: 'AKIAI5ZM5TTMEUXIHZDA',
//   secretAccessKey: '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',
// });

// const s3 = new AWS.S3();
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'p-connect',
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });

router.post('/upload', function (req, res) {
  // const image = req.files.profileImage.pop(); //One way to access unnamed object
  // image = req.files['profileImage'][0].location; //Second way to access unnamed object
  // const token = req.header('x-auth');

  const body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    session: req.body.session,
    city: req.body.city,
    stream: req.body.stream,
    phone: req.body.phone,
    profession: req.body.profession,
    password: req.body.password,
    repeatPassword: req.body.repeatPassword,
    experience: req.body.experience,
    roles: req.body.roles,
    // location: req.file.location,
    // img: req.file.img,
    teaching: req.body.teaching,
    working: req.body.working,
    allowAccess: req.body.allowAccess,
    // certificate: req.file.originalname,
  };
  const user = new User(body);

  user
    .save()
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});
// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadLocation);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// var uploadImg = multer({ storage: storage });
// router.post(
//   '/img/:id',
//   uploadImg.fields([{ name: 'img' }]),
//   function (req, res) {
//     const body = req.body;
//     const files = req.files;
//     User.findByIdAndUpdate(
//       req.params.id,

//       { img: files.img[0].filename }
//     )
//       // console.log(body);
//       // const user = new User(body);
//       // user
//       //   .save()
//       .then(function (user) {
//         res.send(user);
//       })
//       .catch(function (err) {
//         res.send(err);
//       });
//   }
// );
router.post('/register', function (req, res) {
  const body = req.body;
  console.log(body);
  const user = new User(body);
  user
    .save()
    .then(function (user) {
      res.send(user).status(200);
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    });
});

router.get('/display/invites/:userId', function (req, res) {
  // console.log(req.params.userId);
  User.findById(req.params.userId)

    .populate('event')

    .then((user) => {
      // console.log(user.event);
      res.send(user.event);
    });
});
router.get('/display/comment/:userId', function (req, res) {
  // console.log(req.params.userId);
  User.findById(req.params.userId)
    .sort({ date: -1 })
    .populate('comment')

    .then((user) => {
      // console.log(user.event);
      res.send(user.comment);
    });
});
router.get('/display1/message/:userId', function (req, res) {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    .sort({ createdAt: -1 })
    .populate('message')
    .then((user) => {
      console.log(user);
      res.send(user.message);
    });
});
router.get('/display1/rating/:userId', function (req, res) {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    .populate('rating')
    .then((user) => {
      console.log(user);
      res.send(user.rating);
    });
});

router.post(
  '/login',
  authenticateAccess,
  authenticateSubscription,
  function (req, res) {
    console.log('hola');
    const body = req.body;
    User.findByCredentials(body.email, body.password)
      .then(function (user) {
        return user.generateToken();
      })
      .then(function (token) {
        // res.setHeader('x-auth', token).send({}) Use this with postman
        res.setHeader('x-auth', token);
        res.send({ token }); //use this for react frontend to store token in localstorage
      })
      .catch(function (err) {
        res.send(err);
      });
  }
);

router.get('/account', function (req, res) {
  User.find({})
    .sort({ createdAt: -1 })
    .populate('rating')
    .then((users) => res.send(users));
});

router.get('/account/:id', function (req, res) {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      res.json(data);
    }
  });
});
router.post('/update1/:id', function (req, res) {
  const body = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    {
      working: req.body.working,
      teaching: req.body.teaching,
      phone: req.body.phone,
      specialization: req.body.specialization,
      underGraduate: req.body.underGraduate,
      postGraduate: req.body.postGraduate,
      underGraduateCollege: req.body.underGraduateCollege,
      postGraduateCollege: req.body.postGraduateCollege,
      bio: req.body.bio,
      notice: req.body.notice,
    },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.put('/allow/:id', function (req, res) {
  const body = res.body;

  console.log(req.params.id);

  User.findByIdAndUpdate(
    req.params.id,
    { allowAccess: req.body.allowAccess },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })

    .catch(function (err) {
      res.send(err);
    });
});

router.put('/update/:id', function (req, res) {
  const body = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { event: req.body.eventId } },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.put('/rating/:id', function (req, res) {
  const body = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    {
      $push: { rating: req.body.ratingId },
    },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.get('/getContribution/:userId', function (req, res) {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    .sort({ date: -1 })
    .populate('contributeId')
    .then((user) => {
      console.log(user);
      res.send(user.contributeId);
    });
});
router.put('/my/:id', function (req, res) {
  const body = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { message: req.body.messageId } },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.put('/mycomment/:id', function (req, res) {
  const body = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { comment: req.body.commentId } },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.put('/myContribute/:id', function (req, res) {
  const body = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { $push: { contributeId: req.body.id } },
    { new: true }
  )
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});
router.post('/professionalRegister', function (req, res) {
  console.log('/send email');
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var message = `<p style='font-weight:bold;'> ${req.body.firstName} ${req.body.lastName},</p>
  <p>Thank you for joining us </p>
  <h4 style='font-weight:bold;'>We must urge you to wait to verify your certificate by our orgnization then you can freely access your account.</h4>
<p>Once your account is verified you will get an email regarding the confirmation.</p>
  <p style='font-weight:bold;'>Thanks and Regards,</p>
  <p style='font-weight:bold;'>P-Connect</p>
  
  `;

  let mailOptions = {
    from: 'prajapatchinmay999@gmail.com',
    to: req.body.email,
    subject: 'Account Register',
    html: message,
    // `${req.body.firstName} ${req.body.lastName} Thank you for joining us and we hope that you would enjoy our services.`,
  };
  transporter
    .sendMail(mailOptions)
    .then(function (response) {
      console.log('Email Sent !!!');
    })

    .catch(function (error) {
      console.log(error);
    });
});
router.post('/confirm', function (req, res) {
  console.log('/send email');
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var message = `<p style='font-weight:bold;'> ${req.body.firstName} ${req.body.lastName},</p>
  <p>Thank you for joining us </p>
  <h4 style='font-weight:bold;'>We are glad to inform you that your account has been verified successfully and now on you can access your account.</h4>
<p>We highly recommend you to please update your profile to get requests for the session. And we also urge you to keep sharing knowledge or anything which enhance our user's knowledge. Keep answering user's queries, get a good rating as well as good feedback so you would be noted by other users too. 
Finally, we glad to have you on the board.</p>
<p>If there is anything apart from academia or work, please share it from our <b>About</b> section.</p>
  <p style='font-weight:bold;'>Thanks and Regards,</p>
  <p style='font-weight:bold;'>P-Connect</p>
  
  `;

  let mailOptions = {
    from: 'prajapatchinmay999@gmail.com',
    to: req.body.email,
    subject: 'Account Register',
    html: message,
    // `${req.body.firstName} ${req.body.lastName} Thank you for joining us and we hope that you would enjoy our services.`,
  };
  transporter
    .sendMail(mailOptions)
    .then(function (response) {
      console.log('Email Sent !!!');
    })

    .catch(function (error) {
      console.log(error);
    });
});
router.post('/userRegister', function (req, res) {
  console.log('/send email');
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var message = `<p style='font-weight:bold;'> ${req.body.firstName} ${req.body.lastName},</p>
  <p>Thank you for joining us and we hope our services would help you to enhance your knowledge</p>
  <p>Please follow some guidelines before using any services of P-Connect</p>
  <p>We must request you to please be generous to our professionals</p>
  <p>You can ask as many as questions to our any of professionals(if worth to ask) and they will answer your doubts,If you feel ignorance from any kind of request being made by you to professionals, please feel free to contact us and we will make sure that we will justify your cause as soon as possible.</p>
  <p>There is no any extra charges for guidance or messages from professionals if you found any kind of request made by any of professional, please let us know</p>
  <p style='font-weight:bold;'>Thanks and Regards,</p>
  <p style='font-weight:bold;'>P-Connect</p>
  
  `;

  let mailOptions = {
    from: 'prajapatchinmay999@gmail.com',
    to: req.body.email,
    subject: 'Account Register',
    html: message,
    // `${req.body.firstName} ${req.body.lastName} Thank you for joining us and we hope that you would enjoy our services.`,
  };
  transporter
    .sendMail(mailOptions)
    .then(function (response) {
      console.log('Email Sent !!!');
    })

    .catch(function (error) {
      console.log(error);
    });
});
router.post('/acceptMail', function (req, res) {
  console.log('/send email');
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var message = `<p style='font-weight:bold;'> ${req.body.firstName} ${req.body.lastName},</p>
  <p>has accepted your request. We request you to please contact to professional before the session for the arrangments.</p>
  <h3 style='font-weight:bold;'>These are the contact details:-</h3>

  <p>${req.body.email}</p>
  <p style='font-weight:bold;'>Thanks and Regards,</p>
  <p style='font-weight:bold;'>P-Connect</p>
  `;
  let mailOptions = {
    from: 'prajapatchinmay999@gmail.com',
    to: req.body.email,
    subject: 'Your request has been approved by our professional',
    html: message,
  };
  transporter
    .sendMail(mailOptions)
    .then(function (response) {
      console.log('Email Sent !!!');
    })

    .catch(function (error) {
      console.log(error);
    });
});
router.post('/rejectMail', function (req, res) {
  console.log('/send email');
  console.log(req.body);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var message = `<p style='font-weight:bold;'> ${req.body.firstName} ${req.body.lastName}, has rejected your request.</p>
  <p>
  We still recommend to choose other professional or wait and try after sometime</p>
  <p style='font-weight:bold;'>Thanks and Regards,</p>
  <p style='font-weight:bold;'>P-Connect</p>
  `;
  let mailOptions = {
    from: 'prajapatchinmay999@gmail.com',
    to: req.body.email,
    subject: 'Your Request has been rejected by the professional',
    html: message,
  };
  transporter
    .sendMail(mailOptions)
    .then(function (response) {
      console.log('Email Sent !!!');
    })

    .catch(function (error) {
      console.log(error);
    });
});
router.delete('/logout', function (req, res) {
  const { user, token } = req;
  User.findByIdAndUpdate(user.id, { $pull: { tokens: { token: token } } })
    .then(function () {
      res.send({ notice: 'successfully logged out' });
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.delete('/logoutALL', authenticateUser, function (req, res) {
  const { user } = req;
  User.findByIdAndUpdate(user._id, { $set: { tokens: [] } })
    .then(function () {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = {
  usersRouter: router,
};
