const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', droneController.landing);
router.get('/drones', droneController.getDrones);

router.get('/search-drones', droneController.searchDrones);

router.get('/add-drone', droneController.addDrone); // Render Drone Form
router.post('/add-drone', catchErrors(droneController.createDrone)); // Post Drone Form to DB

// router.get('/confirm-payment', catchErrors(droneController.confirmPayment));
// router.get('/order-status', catchErrors(droneController.orderStatus));

module.exports = router;
