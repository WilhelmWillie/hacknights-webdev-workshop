const express = require('express');
const router = express.Router();

const Tip = require('../models/Tip');

const moment = require('moment');

// Get all tips in the database
router.get('/', (req, res) => {
  Tip.find({}, null, {sort: {created: -1}}, function (err, tips) {
    if (err) {
      res.render('error');
    } else {
      res.render('home', {
        tips: tips,
        moment: moment,
        content: req.flash('content') || '',
        author: req.flash('author') || '',
        errors: req.flash('errors')
      });
    }
  });
});

// View a single tip
router.get('/tip/:id', (req, res) => {
  Tip.findById(req.params.id, function (err, tip) {
    if (err) {
      // Display error page if we can't find Tip
      res.render('error');
    } else {
      // Display Tip, pass moment a time format library
      res.render('tip', {
        tip: tip,
        moment: moment
      });
    }
  });
});

// Create a new tip
router.post('/tip/new', (req, res) => {
  const content = req.body.content;
  const author = req.body.author;

  let error = false;

  // Validate user input
  if (content === undefined || content.trim() === '') {
    req.flash('errors', 'Content can not be empty');
    error = true;
  }

  if (author === undefined || author.trim() === '') {
    req.flash('errors', 'Author can not be empty');
    error = true;
  }

  if (content.length > 300) {
    req.flash('errors', 'Content must be less than 300 characters');
    error = true;
  }

  // If there is an error, redirect back to the home page
  if (error) {
    req.flash('content', content);
    req.flash('author', author);
    res.redirect('/');
    return;
  }

  // Otherwise, try to create a Tip object and save it to the database
  const tip = new Tip({
    content: content,
    author: author
  });

  tip.save(function (err) {
    if (err) {
      return res.render('error');
    }

    return res.redirect('/');
  });
});

module.exports = router;
