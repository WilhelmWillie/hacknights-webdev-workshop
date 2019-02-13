const express = require('express');
const router = express.Router();

// TODO: Import Tip model

const moment = require('moment');

// TODO: Get all tips in the database
router.get('/', (req, res) => {
  return res.send('all tips');
});

// TODO: View a single tip
router.get('/tip/:id', (req, res) => {
  return res.send('single tip');
});

// TODO: Create a new tip
router.post('/tip/new', (req, res) => {
  return res.send('new tip');
});

module.exports = router;
