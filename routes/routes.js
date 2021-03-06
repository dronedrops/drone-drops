const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', droneController.landing);
router.get('/search-drones', droneController.renderSearchDrone);

/** Helper Routers. For Dev purpose only. */

router.get('/update-drone', droneController.renderAddDrone); // Render Drone Form

router.post('/update-drone', droneController.upload, catchErrors(droneController.resize), catchErrors(droneController.createDrone)); // Post Drone Form to DB

router.post('/update-drone/:id', droneController.upload, catchErrors(droneController.resize), catchErrors(droneController.updateDrone)); // Find & Updated Drone to DB

router.get('/drones', catchErrors(droneController.getDrones));
router.get('/drones/:id/edit', catchErrors(droneController.renderEditDrone));

router.get('/drone/:slug', catchErrors(droneController.getDroneBySlug));

router.get('/confirm-payment', catchErrors(droneController.confirmPayment));
router.get('/order-status', catchErrors(droneController.getOrderStatus));

// API Routes
router.get('/api/search', catchErrors(droneController.searchDrones));

// http://localhost:7777/api/drones/near?lng=-0.08653000000003885&lat=51.5136799
router.get('/api/drones/near', catchErrors(droneController.findNearbyDrones));

// http://localhost:7777/api/validateOrder?droneId=123&consumerEth=0x6fc532b497073b0f0c612a369beea7d541538a58
router.get('/api/validateOrder', catchErrors(droneController.validateOrder));

// http://localhost:7777/api/updateOrderStatus?orderId=20&droneId=456&consumerEth=0x6fc532b497073b0f0c612a369beea7d541538a58&deliverToPostCode=ls101ea
router.get('/api/updateOrderStatus', catchErrors(droneController.updateOrderStatus));

router.get('/api/flyElite', catchErrors(droneController.flyElite));

router.get('/api/flyMambo', catchErrors(droneController.flyMambo));
/* 
http://localhost:7777/api/emitMessage?message=Package In Transit&element=packageInTransit
http://localhost:7777/api/emitMessage?message=Order Created&element=orderCreated
http://localhost:7777/api/emitMessage?message=Drone Verified&element=droneVerified
http://localhost:7777/api/emitMessage?message=Package Delivered&element=packageDelivered
http://localhost:7777/api/emitMessage?message=Payment Settled&element=paymentSettled



*/
router.get('/api/emitMessage', catchErrors(droneController.emitMessage));

module.exports = router;
