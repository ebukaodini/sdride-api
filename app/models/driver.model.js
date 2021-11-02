const mongoose = require('mongoose');

let driverSchema = mongoose.Schema({
  car: {
    type: String
  },
  name: {
    type: String
  },
  isOnline: {
    type: Boolean
  },
  location: {
    lat: Number,
    lng: Number
  },
});

module.exports = mongoose.model("Driver", driverSchema);