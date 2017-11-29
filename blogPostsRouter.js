'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');
const { BlogSchema } = require('./schemas.js');

// convenience function for generating lorem text for blog
// posts we initially add below
function lorem() {
  return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ';
  'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
    'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non ' +
    'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
}

// seed some posts so initial GET requests will return something
// BlogPosts.create(
//   '10 things -- you won\'t believe #4', lorem(), 'Billy Bob');
// BlogPosts.create(
//   'Lions and tigers and bears oh my', lorem(), 'Lefty Lil');


// add endpoint for GET. It should call `BlogPosts.get()`
// and return JSON objects of stored blog posts.
// send back JSON representation of all blog posts
// on GET requests to root
module.exports = function(app) { 
  app.use(jsonParser);
  
  app.get('/blogposts', (req, res) => {
    //res.json(BlogPosts.get());  //get method comes from the BlogPosts model
    BlogSchema
      .find()
      .then( blogposts => {
        res.json(blogposts);
      })
      .catch( err => {
        res.status(500).json( { message: `Something went wrong! ${err}`});
      });
  });

  app.get('/blogposts/:id', (req, res) => {
    //res.json(BlogPosts.get());  //get method comes from the BlogPosts model
    BlogSchema
      .findById(req.params.id)
      .then( blogpost => {
        res.json(blogpost);
      })
      .catch( err => {
        res.status(500).json( { message: `Something went wrong! ${err}`});
      });
  });
    

  // add endpoint for POST requests, which should cause a new
  // blog post to be added (using `BlogPosts.create()`). It should
  // return a JSON object representing the new post (including
  // the id, which `BlogPosts` will create. This endpoint should
  // send a 400 error if the post doesn't contain
  // `title`, `content`, and `author`
  app.post('/blogposts', jsonParser, (req, res) => {     //pass jsonParser as 2nd param
    const reqFields = [ 'title', 'content', 'author'];
    for (let i=0; i < reqFields.length; i++){
      const field = reqFields[i];
      if (!( field in req.body)){
        const message = `Missing \`${field}\` in request body`;
        //console.error(message);
        return res.status(400).send(message);
      }
    }
    
    const blogpost = BlogPosts.create( req.body.title, req.body.content, req.body.author );
    res.status(201).json(blogpost);
  });

  // add endpoint for PUT requests to update blogposts. it should
  // call `BlogPosts.update()` and return the updated post.
  // it should also ensure that the id in the object representing
  // the post matches the id of the path variable, and that the
  // following required fields are in request body: `id`, `title`,
  // `content`, `author`, `publishDate`
  app.put('/blogposts/:id', (req, res) => {
    const reqFields = [ 'title', 'content', 'author' ];
    for (let i=0; i < reqFields.length; i++){
      const field = reqFields[i];
      if (!( field in req.body)){
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id){
      const message =  `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
      console.log(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post ${req.params.id}`);
    const updatedPost = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });
    res.status(204).json(updatedPost);
  });

  // add endpoint for DELETE requests. These requests should
  // have an id as a URL path variable and call
  // `BlogPosts.delete()`
  app.delete('/blogposts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted item ${req.params.id}`);
    res.status(204).end();
  });


};