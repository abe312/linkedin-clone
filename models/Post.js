const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = require('./Like');
const commentSchema = require('./Comment');

// create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
    required: true,
  },
  name: String,
  avatar: String,
  likes: [likeSchema],
  comments: [commentSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model('post', PostSchema);
// mongoose.model('post', PostSchema); but then you'll have to require it in server.js file
// const Post = mongoose.model('post');
