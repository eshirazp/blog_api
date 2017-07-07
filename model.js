"use strict";

const mongoose = require('mongoose');

const BlogPostSchema = mongoose.Schema({
  "title":    {type: String, required: true},
  "content":  {type: String, required: true},
  "author": 
  {
    "firstName":  {type: String, required: true},
    "lastName":   {type: String, required: true}
  },
  "created": {type: Date, default: Date.now}
});

BlogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
})

BlogPostSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created
  };
}

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = {BlogPost};