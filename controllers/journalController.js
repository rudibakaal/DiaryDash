// const express = require('express');
// const router = express.Router();
// const Journal = require('../models/journalModel');

// // Endpoint to create a new journal entry
// router.post('/journalEntry', async (req, res) => {
//   try {
//     const { title, content, attachments } = req.body;

//     // Create a new journal entry in the database
//     const newEntry = new Journal({
//       title,
//       content,
//       attachments,
//     });

//     // Save the journal entry to the database
//     const savedEntry = await newEntry.save();


//     res.status(201).json({ message: 'Journal entry created successfully', entry: savedEntry });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Journal = require('../models/journalModel');

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
