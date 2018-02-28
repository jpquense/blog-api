'use strict';
const mongoose = require('mongoose');

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  created: number 
});

blogSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim()});

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.fullName,
    created: this._created
  };
}

const BlogPosts = mongoose.model('BlogPost', blogSchema);

module.exports = {BlogPosts};
