"use strict";

const express = require('express');
const morgan = require('morgan');

// Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');

const blogPostsRouter = require('./blogPostsRouter');

const app = express();

/* Middleware for debugging */
app.use(morgan('common'));

/* Middleware that leads to the Rest API */
app.use('/posts', blogPostsRouter);

app.get('/', (req, res) => res.send('Home Page'));

let server;

function runServer(database_url=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to database ${database_url}`);
    mongoose.connect(database_url, err => {
      if(err) {
        return reject(err);
      }
      server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
      }).on('error', err => {
        mongoose.disconnect();
        reject(err)
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};