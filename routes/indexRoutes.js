// routes/indexRoutes.js
const express = require('express');
const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, continue to the next middleware or route handler
  }
  res.status(401).json({ error: 'Unauthorized' }); // User is not authenticated, return a 401 Unauthorized status
};

// Protected user-data route
router.get('/user-data', isAuthenticated, (req, res) => {
  // Fetch user details from the authenticated user 
  const user = req.user;
  // Send user data as JSON response
  res.json({ user });
});

module.exports = router;
