// useModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});



const User = mongoose.model('User', userSchema);

module.exports = User;
