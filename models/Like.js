const mongoose = require('mongoose');

const { Schema } = mongoose;

const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = likeSchema;
