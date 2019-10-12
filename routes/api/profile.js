const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');

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

module.exports = router;
