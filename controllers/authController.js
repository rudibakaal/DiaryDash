// controllers/authController.js

const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Function to generate a random salt
const generateSalt = () => {
  return bcrypt.genSaltSync(10); // 10 is the number of rounds to use
};

// Function to hash a password with a given salt
const hashPassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Generate a unique salt for each user
    const salt = generateSalt();

    // Hash the password using the generated salt
    const hashedPassword = hashPassword(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      salt, // Store the salt along with the hashed password
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
