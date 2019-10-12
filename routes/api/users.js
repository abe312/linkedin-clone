const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// load user model
const User = require('../../models/User');
/*
  @route    GET api/users/test
  @desc     Tests users route
  @access   public
*/
router.get('/test', (req, res) => {
  return res.json({ msg: 'user works' });
});

/*
  @route    GET api/users/register 
  @desc     register user
  @access   public
*/
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    console.log('error', errors);
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    errors.email = 'email already exists';
    return res.status(400).json(errors);
  } else {
    const avatar = gravatar.url(req.body.email, {
      s: '200', //size
      r: 'pg', //'rating'
      d: 'mm', // default
    });
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      avatar,
      password,
    });

    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        try {
          const user = await newUser.save();
          res.json(user);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
});

/*
  @route    GET api/users/login
  @desc     login user (returning jwt )
  @access   public
*/
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    errors.email = 'user not found';
    return res.status(404).json(errors);
  }

  bcrypt.compare(password, user.password, (err, isMatch) => {
    // console.log(isMatch);
    if (isMatch) {
      // res.json({ msg: 'success' });
      // user matched

      const payload = { id: user.id, name: user.name, avatar: user.avatar }; // create jwt payload

      // sign token
      jwt.sign(payload, keys.secret, { expiresIn: 36000 }, (err, token) => {
        res.json({
          success: true,
          token: 'Bearer ' + token,
        });
        console.log('here login', token);
      });
    } else {
      errors.password = 'password incorrect';
      return res.status(400).json(errors);
    }
  });
});

/*
  @route    GET api/users/current
  @desc     return current user
  @access   private
*/
router.post(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id,
      name,
      email,
    });
  },
);

module.exports = router;
