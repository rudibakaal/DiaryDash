const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    // Extract user registration data from the request body
    const { username, password } = req.body;


    // Validate the user here later
    

    // Create a new user in the database
    const newUser = new User({
      username,
      password,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
