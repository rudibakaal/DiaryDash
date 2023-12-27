const express = require('express');
const router = express.Router();
const Journal = require('../models/journalModel');


// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // create basic unauthorised access HTML page later
    res.redirect('/access-denied');
  }
};

// Protected route requiring authentication
router.get('/protected-route', ensureAuthenticated, (req, res) => {
  res.send('This route is protected and requires authentication.');
});

// Route for saving a journal entry
router.post('/save-entry', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new journal entry
    const newEntry = new Journal({
      title: title,
      content: content,
    });

    // Save the entry to the database
    const savedEntry = await newEntry.save();

    res.json({ message: 'Entry saved successfully', entry: savedEntry });
  } catch (error) {
    console.error('Error saving entry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
