const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ email: 'email already exists' });
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
  @desc     login user
  @access   public
*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  bcrypt.compare(password, user.password, (err, isMatch) => {
    console.log(isMatch);
    if (isMatch) {
      res.json({ msg: 'success' });
    } else {
      return res.status(400).json({ password: 'password incorrect' });
    }
  });
});

module.exports = router;
