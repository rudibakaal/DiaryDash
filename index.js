const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const databaseConfig = require('./config/database');
const UserModel = require('./models/userModel');
const multerConfig = require('./config/multer');
const authController = require('./controllers/authController');
const authRegister = require('./auth/authRegister');
const journalController = require('./controllers/journalController'); 



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/auth', authRegister);

app.use('/api', journalController); // Assuming journal entries posted to route /api/journalEntry


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


mongoose.connect(databaseConfig.url, databaseConfig.options)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
