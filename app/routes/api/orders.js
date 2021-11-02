var express = require('express');
const { serverError, success, badRequest } = require('../../utils/response-helpers');
var router = express.Router();
const orders = require('../../models/order.model');
const drivers = require('../../models/driver.model');

// Get pending orders
router.get('/pending', function (req, res) {
  try {
    orders.find({
      isPending: true,
      isAccepted: false,
      hasStarted: false,
      hasCompleted: false
    })
      .then(pendingOrders => {
        success(res, 'Pending orders', pendingOrders);
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message)
  }
})

// Check if order is accepted
router.get('/:id/status/accepted', function (req, res) {
  try {
    let orderId = req.params.id;

    orders.findById(orderId)
      .then(async order => {
        if (order.isAccepted == true && order.driverId !== null) {
          let acceptedDriver = await drivers.findById(order.driverId);
          success(res, 'Order accepted', { accepted: true, driver: acceptedDriver });
        } else {
          success(res, 'Order is not yet accepted', { accepted: false })
        }
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message)
  }
})

// Create new order
router.post('/create', async function (req, res) {
  try {
    let { destName, destAddress, destLat, destLng, originLat, originLng, id } = req.body;

    let orderCount = await orders.count();

    if (orderCount > 0) {
      orders.find()
        .then(order => {
          orders.findByIdAndUpdate(order[0]._id, {
            riderId: id,
            origin: {
              lat: originLat,
              lng: originLng
            },
            destination: {
              name: destName,
              address: destAddress,
              lat: destLat,
              lng: destLng
            },
            isPending: true,
            isAccepted: false,
            hasStarted: false,
            hasCompleted: false,
            driverId: ''
          }, { new: true })
            .then(updateOrder => {
              success(res, 'Order created', { order: updateOrder });
            })
            .catch(err => {
              badRequest(res, err.message);
            })
        })
        .catch(err => {
          badRequest(res, err.message);
        })
    } else {
      orders.create({
        riderId: id,
        origin: {
          lat: originLat,
          lng: originLng
        },
        destination: {
          name: destName,
          address: destAddress,
          lat: destLat,
          lng: destLng
        }
      })
        .then(order => {
          success(res, 'Order created', order);
        })
        .catch(err => {
          badRequest(res, err.message);
        })
    }
  } catch (error) {
    serverError(res, error.message);
  }
});

// Accept order
router.post('/accept', function (req, res) {
  try {
    let orderId = req.body.id;
    let driverId = req.body.driverId;

    orders.findByIdAndUpdate(orderId, { driverId: driverId, isPending: false, isAccepted: true })
      .then(_ => {
        success(res, 'Order is accepted');
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, err.message);
  }
});

// Cancel ride/order
router.post('/cancel', function (req, res) {
  try {
    let orderId = req.body.id;

    orders.findByIdAndUpdate(orderId, { isPending: true, isAccepted: false, hasStarted: false, hasCompleted: false })
      .then(_ => {
        success(res, 'Order is cancelled');
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
})

// Start ride
router.post('/start', function (req, res) {
  try {
    let orderId = req.body.id;

    orders.findByIdAndUpdate(orderId, { hasStarted: true })
      .then(_ => {
        success(res, 'Ride has started');
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
})

// Complete ride
router.post('/complete', function (req, res) {
  try {
    let orderId = req.body.id;

    orders.findByIdAndUpdate(orderId, { hasCompleted: true })
      .then(_ => {
        success(res, 'Ride has completed');
      })
      .catch(err => {
        badRequest(res, err.message);
      })
  } catch (error) {
    serverError(res, error.message);
  }
})

module.exports = router;
