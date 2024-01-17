// controllers/journalController.js
const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/journalModel');

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // Redirect to an access-denied page or handle unauthorized access
    res.redirect('/access-denied');
  }
};

// Protected route requiring authentication
router.get('/protected-route', ensureAuthenticated, (req, res) => {
  res.send('This route is protected and requires authentication.');
});

// Handle saving a new journal entry
router.post('/save-entry', ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id; // Get the user ID from the logged-in user

    const newEntry = new JournalEntry({
      title,
      content,
      user: userId, // Associate the entry with the user
    });

    const savedEntry = await newEntry.save();

    res.json({ message: 'Entry saved successfully', entry: savedEntry });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
