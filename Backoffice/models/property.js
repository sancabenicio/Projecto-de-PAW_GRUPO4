const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  place_id: {
    type: String,
    required: false
  },
  lon : {
    type: String,
    required: false
  },
  lat : {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  district: {
    type: String,
    required: false
  },
  country:{
    type: String,
    required: false
  },
  street: {
    type: String,
    required: false
  },
  code: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  heritage: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  formatted: {
    type: String,
    required: false
  },
  photos: {
    data: Buffer,
    contentType: String,
  }
});

module.exports = mongoose.model('Property', propertySchema);

