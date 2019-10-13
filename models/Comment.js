const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = commentSchema;
