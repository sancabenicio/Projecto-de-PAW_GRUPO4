const mongoose = require('mongoose');
const { isEmail } = require('validator');

const employeeSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    email: {
        type: String,
        validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
    },
  });

  module.exports = mongoose.model('Employee', employeeSchema);