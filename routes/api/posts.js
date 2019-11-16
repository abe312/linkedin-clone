const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// validation
const validatePostInput = require('../../validation/post');

// @route    GET api/posts
// @desc     Get posts
// @access   Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (e) {
    res.status(400).json({ err: 'no posts found' });
  }
});

// @route    GET api/posts/:id
// @desc     Get posts by id
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(400).json({ err: 'post not found' });
  }
});

// @route    DELETE api/posts/:id
// @desc     delete posts by id
// @access   Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        const post = await Post.findById(req.params.id);
        // check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'user not authorized' });
        }

        // delete
        await post.remove();
        res.json({ success: true });
      }
    } catch (e) {
      res.status(400).json({ err: 'some error occured | post not found ' });
    }
  },
);

// @route  POST api/posts
// @desc   Create post
// @access Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const newPost = new Post({
      text,
      name,
      avatar,
      user: req.user.id,
    });

    try {
      const post = await newPost.save();
      res.json(post);
    } catch (e) {
      res.status(400).json({ err: 'some error occured :(' });
    }
  },
);

// like and remove like
// @route    POST api/posts/like/:id
// @desc     Like a post by post id
// @access   Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user.id;
    try {
      const profile = await Profile.findOne({ user });
      if (profile) {
        let post = await Post.findById(req.params.id);
        if (
          post.likes.filter(like => like.user.toString() === user).length > 0
        ) {
          return res.status(400).json({ alreadyliked: 'user already liked' });
        }
        // add user id to likes array
        post.likes.unshift({ user });
        post = await post.save();
        res.json(post);
      }
    } catch (e) {
      res.status(400).json({ err: 'some error occured | post not found ' });
    }
  },
);

// @route    POST api/posts/unlike/:id
// @desc     unLike a post by post id
// @access   Private
router.delete(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user.id;
    try {
      const profile = await Profile.findOne({ user });
      if (profile) {
        let post = await Post.findById(req.params.id);
        if (
          post.likes.filter(like => like.user.toString() === user).length === 0
        ) {
          return res
            .status(400)
            .json({ notyetliked: 'not yet liked this post' });
        }
        // get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(user);

        // splice out of array
        post.likes.splice(removeIndex, 1);

        post = await post.save();
        res.json(post);
      }
    } catch (e) {
      res.status(400).json({ err: 'some error occured | post not found ' });
    }
  },
);

// add and remove comments

// @route    POST api/posts/comment/:id
// @desc     comment on a post by post id
// @access   Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const user = req.user.id;
    const { text, name, avatar } = req.body;
    try {
      let post = await Post.findById(req.params.id);

      const newComment = {
        text,
        name,
        avatar,
        user,
      };

      // add to comments array
      post.comments.unshift(newComment);
      post = await post.save();
      res.json(post);
    } catch (e) {
      return res.status(400).json({ err: 'some error occured | post not found ' });
    }
  },
);

// @route    DELETE api/posts/comment/:id
// @desc     delete a comment
// @access   Private
router.delete(
  '/comment/:post_id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // const user = req.user.id;
    try {
      let post = await Post.findById(req.params.post_id);
      // check to see if the comment exists
      if (
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id,
        ).length === 0
      ) {
        res.status(404).json({ commentnotexists: 'comment does not exists' });
      }

      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      // splice comment out of array
      post.comments.splice(removeIndex, 1);
      post = await post.save();
      res.json(post);
    } catch (e) {
      res.status(400).json({
        err: 'some error occured | post not found | comment not found',
      });
    }
  },
);

module.exports = router;
