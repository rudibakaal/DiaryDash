const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 

// Route for user registration

console.log(authController.registerUser)
router.post('/register', authController.registerUser);

module.exports = router;