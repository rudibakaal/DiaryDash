const express = require('express');
const mongoose = require('mongoose');
const databaseConfig = require('./config/database');
const appConfig = require('./config/app');
const authConfig = require('./config/auth');
const multerConfig = require('./config/multer');

const app = express();

// Connect to MongoDB using the configuration
mongoose.connect(databaseConfig.url, databaseConfig.options)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


app.get('/', (req,res) => {
  res.json('hi!')
})

