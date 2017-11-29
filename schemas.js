'use strict';

const mongoose = require('mongoose');

// this is our schema to represent a blogpost
const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  created: {type: Date, required: true},
  author: {
    firstName: String,
    lastName: String
  }
});

const BlogSchema = mongoose.model('Blogpost', blogSchema);

module.exports = { BlogSchema };