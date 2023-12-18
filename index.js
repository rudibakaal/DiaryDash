const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 
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
app.use('/api', journalController);


app.get('/', (req, res) => {
  res.sendFile('registration.html', { root: __dirname + '/views' });
});

app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));



app.get('/entry', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/views' });
});





app.post('/api/save-entry', (req, res) => {
  const content = req.body;

  console.log('Received content:', content);

  res.json({ message: 'Entry saved successfully' });
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
