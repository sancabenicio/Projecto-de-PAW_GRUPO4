const mongoose = require('mongoose');
const { isDate } = require('validator');

const ticketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        required: true,
        validator: [isDate, 'Please enter a valid date']
      },      
      price: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        required: true,
      }
    });

module.exports = mongoose.model('Ticket', ticketSchema);