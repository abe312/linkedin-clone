const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Profile
const User = require('../../models/User');

// @routeGET api/profile
// @desc Get Current user's profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const errors = {};

    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name', 'avatar'],
      );
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    } catch (err) {
      res.status(404).json(err);
    }
  },
);

// @route POST api/profile
// @desc create user's profile or update
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const fields = {};
    const user = req.user.id;
    fields.user = user; // avatar, name and email
    const {
      handle,
      company,
      website,
      location,
      status,
      skills,
      bio,
      github,
      date,
    } = req.body;

    if (handle) fields.handle = handle;
    if (company) fields.company = company;

    if (website) fields.website = website;

    if (location) fields.location = location;
    if (status) fields.status = status;

    // split into array
    if (typeof req.body.skills !== 'undefined') {
      fields.skills = skills.split(',');
      fields.skills = fields.skills.map(item => item.trim());
    }

    if (bio) fields.bio = bio;
    if (github) fields.github = github;
    if (date) fields.date = date;
    // experience, education, social

    fields.social = {};

    const { youtube, facebook, twitter, instagram } = req.body;
    fields.social.youtube = youtube;
    fields.social.facebook = facebook;
    fields.social.twitter = twitter;
    fields.social.instagram = instagram;

    const profileExists = await Profile.findOne({ user });
    if (profileExists) {
      //update
      const profile = await Profile.findOneAndUpdate(
        { user },
        { $set: fields },
        { new: true },
      );
      res.json(profile);
    } else {
      // create

      // check to see if handle exists
      let profile = await Profile.findOne({ handle });
      if (profile) {
        errors.handle = 'That handle already exists';
        res.status(400).json(errors);
      }

      // save profile
      profile = await new Profile(fields).save();
      res.json(profile);
    }
  },
);

// @routeGET api/profile/hanlde/:handle
// @desc Get a profile by handle
// @access Public

router.get('/handle/:handle', async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      handle: req.params.handle,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.noprofile = 'there is no profile for this user';
      res.status(404).json(errors);
    }

    res.json(profile);
  } catch (err) {
    res.status(404).json(err);
  }
});

// @routeGET api/profile/user/:user_id
// @desc Get a profile by user id
// @access Public

router.get('/user/:user_id', async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      errors.noprofile = 'there is no profile for this user';
      res.status(404).json(errors);
    }

    res.json(profile);
  } catch (err) {
    res.status(404).json({ profile: 'there is no profile for this user' });
  }
});

// @route GET api/profile/all
// @desc Get a profiles
// @access Public
router.get('/all', async (req, res) => {
  const errors = {};
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);
  if (!profiles) {
    errors.noprofile = 'There are no profiles';
    return res.status(404).json(errors);
  }
  res.json(profiles);
});

// @route   POST api/profile/experience
// @desc    ADD  experience to profile
// @access  Private

router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let profile = await Profile.findOne({ user: req.user.id });
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    // add to exp array
    profile.experience.unshift(newExp);

    profile = await profile.save();
    res.json(profile);
  },
);

// @route   DELETE api/profile/experience
// @desc    DELETE  experience to profile
// @access  Private

router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      // splice out array
      profile.experience.splice(removeIndex, 1);

      // save
      profile = await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(400).json(err);
    }
  },
);

// @route   POST api/profile/education
// @desc    ADD  education to profile
// @access  Private

router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let profile = await Profile.findOne({ user: req.user.id });
    const { school, degree, field, from, to, current, description } = req.body;
    const newEdu = {
      school,
      degree,
      field,
      from,
      to,
      current,
      description,
    };

    // add to exp array
    profile.education.unshift(newEdu);

    profile = await profile.save();
    res.json(profile);
  },
);

// @route   DELETE api/profile/education
// @desc    DELETE  education to profile
// @access  Private

router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      // splice out array
      profile.education.splice(removeIndex, 1);

      // save
      profile = await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(400).json(err);
    }
  },
);

// @route   DELETE api/profile/education
// @desc    DELETE  user and profile
// @access  Private

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.user.id;
    await Profile.findOneAndRemove({ user: id });
    await User.findOneAndRemove({ _id: id });
    res.json({ success: true });
  },
);

module.exports = router;
