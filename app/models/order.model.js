const mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
  origin: {
    lat: Number,
    lng: Number
  },
  destination: {
    name: String,
    address: String,
    lat: Number,
    lng: Number
  },
  riderId: String,
  driverId: String,
  isPending: {
    type: Boolean,
    default: true
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  hasStarted: {
    type: Boolean,
    default: false
  },
  hasCompleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Order', orderSchema);