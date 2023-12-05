const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },lz
  attachments: [
    {
      type: {
        type: String, // "image" or "text"
        enum: ["image", "text"],
        required: true,
      },
      data: String, // Base64-encoded string for images, plain text for text
    },
  ],
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;
