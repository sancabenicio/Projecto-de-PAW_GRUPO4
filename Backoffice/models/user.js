const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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

module.exports = mongoose.model('User', userSchema);