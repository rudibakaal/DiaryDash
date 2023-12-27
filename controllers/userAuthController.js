// controllers/userAuthController.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/userModel'); 

// Function to hash a password with a given salt
const hashPassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

// Function to verify a user's password using the stored salt
const verifyPassword = (enteredPassword, storedPassword, salt) => {
  const hashedEnteredPassword = hashPassword(enteredPassword, salt);
  return hashedEnteredPassword === storedPassword;
};

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // Redirect to the homepage upon successful login
  failureRedirect: '/user-auth/login', // Redirect to the login page upon failed login
  failureFlash: true, // Enable flashing messages in case of authentication failure
}), (req, res) => {
  console.log('Login route reached');

  // Inside the authentication callback function, check if the password is valid
  const enteredPassword = req.body.password; // Assuming the password is sent in the request body
  const user = req.user; // Assuming the user object is available in req.user

  // Check if the entered password is valid
  const isPasswordValid = verifyPassword(enteredPassword, user.password, user.salt);

  // Now you can use the isPasswordValid variable as needed
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Render the login page
router.get(['/login', '/user-auth/login'], (req, res) => {
  res.sendFile('login.html', { root: __dirname + '/../views' });
});

// User registration route
router.post('/register', async (req, res) => {
  // redirect to the main page for the user after this?
});

router.get('/users', async (req, res) => {
  try {
    const allUsers = await User.getAllUsers();
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
