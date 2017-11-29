'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const router = require('./blogPostsRouter.js');
const {BlogPosts} = require('./models.js');

const { BlogSchema } = require('./schemas.js');

mongoose.connect(
  DATABASE_URL, 
  {useMongoClient: true}, 
  err => {
    if (err) {
      console.log(err);
    } 
  }
);

const app = express();

app.use(morgan('common'));

router(app);
//app.use('/blogposts', router);

// you need to import `blogPostsRouter` router and route
// requests to HTTP requests to `/blog-posts` to `blogPostsRouter`

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});


