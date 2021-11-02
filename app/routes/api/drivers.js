const drivers = require('../../models/driver.model');
const { serverError, success, badRequest } = require('../../utils/response-helpers');
const express = require('express');
const router = express.Router();

// Get online drivers
router.get('/online', async function (req, res) {
  try {
    drivers.find({ isOnline: true })
      .then(onlineDrivers => {
        success(res, 'Online drivers', { drivers: onlineDrivers });
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
});

// Create new driver
router.post('/create', async function (req, res) {
  try {
    // return driver if a driver exists in the database
    // or create a new driver and return the driver

    let driversCount = await drivers.count();

    if (driversCount > 0) {
      let driver = await drivers.findOne();
      success(res, 'Driver details', driver);
    } else {
      drivers.create({
        car: 'Toyota Camry',
        name: 'John Driver',
        isOnline: false
      }).then(driver => {
        success(res, 'Driver details', driver);
      })
        .catch(err => {
          badRequest(res, err.message);
        })
    }
  } catch (error) {
    serverError(res, error.message);
  }
});

// Toggle driver online visibility
router.post('/update/online', async function (req, res) {
  try {
    let driverId = req.body.id;
    let isOnline = req.body.isOnline;

    drivers.findByIdAndUpdate(driverId, {
      isOnline: isOnline
    }, { new: true })
      .then(driver => {
        success(res, 'Driver status updated', driver);
      })
      .catch(err => {
        badRequest(res, err.mesage);
      })
  } catch (error) {
    serverError(res, error.message)
  }
});

// Update driver location
router.post('/update/location', async function (req, res) {
  try {
    let lat = req.body.lat;
    let lng = req.body.lng;
    let driverId = req.body.id;

    drivers.findByIdAndUpdate(driverId, { location: { lat: lat, lng: lng } })
      .then(_ => {
        success(res, 'Driver location updated');
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
})

// Get driver location
router.get('/:id/location', function (req, res) {
  try {
    let driverId = req.params.id;

    drivers.findById(driverId)
      .then(driver => {
        success(res, 'Driver location', { location: driver.location });
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
})

module.exports = router;
