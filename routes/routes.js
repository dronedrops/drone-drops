const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', droneController.landing);
router.get('/search-drones', droneController.searchDrones);
router.get('/eth-demo', droneController.ethDemo);

/** Helper Routers. For Dev purpose only. */

router.get('/update-drone', droneController.renderAddDrone); // Render Drone Form
router.post('/update-drone', catchErrors(droneController.createDrone)); // Post Drone Form to DB
router.post('/update-drone/:id', catchErrors(droneController.updateDrone)); // Find & Updated Drone to DB

router.get('/drones', catchErrors(droneController.getDrones));
router.get('/drones/:id/edit', catchErrors(droneController.renderEditDrone));

// router.get('/confirm-payment', catchErrors(droneController.confirmPayment));
// router.get('/order-status', catchErrors(droneController.orderStatus));

module.exports = router;
