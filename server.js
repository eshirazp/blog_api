const express = require('express');
const morgan = require('morgan');
const blogPostsRouter = require('./blogPostsRouter');

const app = express();

/* Middleware for debugging */
app.use(morgan('common'));

/* Middleware that leads to the Rest API */
app.use('/blog-posts', blogPostsRouter);

app.get('/', (req, res) => res.send('Home Page'));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});