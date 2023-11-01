// Create web servervar express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
// var auth = jwt({secret: process.env.JWT_SECRET, userProperty: 'payload'});

// GET /comments
// Route for comments collection
router.get('/', function(req, res, next) {
  Comment.find(function(err, comments) {
    if (err) {
      return next(err);
    }
    res.json(comments);
  });
});

// POST /comments
// Route for creating comments
router.post('/', auth, function(req, res, next) {
  // Create a new comment object
  var comment = new Comment(req.body);
  comment.author = req.payload.username;
  // Save the comment object to the database
  comment.save(function(err, comment) {
    if (err) {
      return next(err);
    }
    res.json(comment);
  });
});

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return next(new Error('can\'t find comment'));
    }
    req.comment = comment;
    return next();
  });
});

// GET /comments/:comment
// Route for specific comments
router.get('/:comment', function(req, res) {
  res.json(req.comment);
});

// PUT /comments/:comment/upvote
// Route for upvoting comments
router.put('/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if (err) {
      return next(err);
    }
    res.json(comment);
  });
});

// POST /comments/:comment/replies
// Route for creating replies
router.post('/:comment/replies', auth, function(req, res, next) {
  var reply = new Comment(req.body);
  reply.author = req.payload.username;
  reply.upvotes = 0;
  reply.save(function(err, reply) {
    if (err) {
      return next(err);
    }
    req.comment.replies.push(reply);
    req.comment