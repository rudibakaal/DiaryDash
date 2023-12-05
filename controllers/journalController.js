 // const Journal = require('../models/journalModel');

 // exports.journalEntry = async (req, res) => {
 //   try {
 //     // Extract user registration data from the request body
 //     const { title, content, date, attachements, data } = req.body;


 //     // Validate the data (you can use a validation library or write your own validation logic)

 //     // Create a new user in the database
 //     const newEntry = new Journal({
 //       title, content, date, attachements, data,
 //     });

 //     // Save the user to the database
 //     const savedEntry = await newEntry.save();

 //     // Optionally, you can send a response indicating success
 //     res.status(201).json({ message: 'Entry saved successfully', Journal: savedEntry });
 //   } catch (error) {
 //     // Handle errors (e.g., duplicate username, database error)
 //     console.error(error);
 //     res.status(500).json({ error: 'Internal Server Error' });
 //   }
 // };


// journalController.js
const express = require('express');
const router = express.Router();
const Journal = require('../models/journalModel');

// Endpoint to create a new journal entry
router.post('/journalEntry', async (req, res) => {
  try {
    const { title, content, attachments } = req.body;

    // Create a new journal entry in the database
    const newEntry = new Journal({
      title,
      content,
      attachments,
    });

    // Save the journal entry to the database
    const savedEntry = await newEntry.save();


    res.status(201).json({ message: 'Journal entry created successfully', entry: savedEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
