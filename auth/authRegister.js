// auth/authRegister.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 

// Route for user registration

console.log(authController.registerUser)
router.post('/index', authController.registerUser);



module.exports = router;
