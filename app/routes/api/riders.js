const express = require('express');
const router = express.Router();
const riders = require('../../models/rider.model');
const { badRequest, success, serverError } = require('../../utils/response-helpers');

// Create new rider
router.post('/create', async function (req, res) {
  try {
    // return rider if a rider exists in the database
    // or create a new rider and return the rider

    let ridersCount = await riders.count();

    if (ridersCount > 0) {
      let rider = await riders.findOne();
      success(res, 'rider details', rider);
    } else {
      riders.create({
        name: 'James Rider'
      }).then(rider => {
        success(res, 'Rider details', rider);
      })
        .catch(err => {
          badRequest(res, err.message);
        })
    }
  } catch (error) {
    serverError(res, error.message);
  }
});

// Update the rider location
router.post('/update/location', async function (req, res) {
  try {
    let lat = req.body.lat;
    let lng = req.body.lng;
    let riderId = req.body.id;

    riders.findByIdAndUpdate(riderId, { location: { lat: lat, lng: lng } })
      .then(_ => {
        success(res, 'Rider location updated');
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
});

// Get rider location
router.get('/:id/location', function (req, res) {
  try {
    let riderId = req.params.id;

    riders.findById(riderId)
      .then(driver => {
        success(res, 'Rider location', { location: driver.location });
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
})

module.exports = router;
