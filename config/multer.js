const multer = require('multer');

// Create a Multer storage engine that stores files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  storage,
  upload
}