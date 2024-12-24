const mongoose = require('mongoose');
const { isDate } = require('validator');
const { isNumeric } = require('validator');

const eventSchema = new mongoose.Schema({
    name: {
      type: String, 
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true,
      validator: [isDate, 'Please enter a valid date']
    },
    capacity: {
      type: Number,
      required: true,
      validator: [isNumeric, 'Please enter a valid number']
      
    },
    ticketPrice: {
      type: Number, 
      required: true,
      validator: [isNumeric, 'Please enter a valid number']
    },
    location: {
      type: Object
    },
    isFree: {
      type: Boolean,
      required: true
    },
    photos: {
      data: Buffer,
      contentType: String,
    },
    ticketsSold: {
      type: Number,
      default: 0
    }
  });

module.exports = mongoose.model('Event', eventSchema);