const mongoose = require('mongoose');

let riderSchema = mongoose.Schema({
  name: {
    type: String
  },
  location: {
    lat: Number,
    lng: Number
  },
})

module.exports = mongoose.model('Rider', riderSchema);