const express = require('express');
const router = express.Router();

// Body Parser for post and put functions
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// Filling the blog posts model with test data
const {BlogPosts} = require('./model');
BlogPosts.create('title1', 'content1', 'author1');
BlogPosts.create('title2', 'content2', 'author2');
BlogPosts.create('title3', 'content3', 'author3');
BlogPosts.create('title4', 'content4', 'author4');

// Retrieve all blog posts
router.get('/', (req, res) => res.json(BlogPosts.get()));

// Create new blog post with required fields for title, content, and author
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(post);
});

// Delete specific, by id, blog post
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  res.status(204).end();
});

// Update existing blog post with required fields for title, content, and author 
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate || Date.now()
  });
  res.status(204).end();
}); 

// export for server.js to use
module.exports = router;

