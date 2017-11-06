const mongoose = require('mongoose');
const Drone = mongoose.model('Drone');

exports.landing = (req,res) => {
    res.render('landing');
} 

/**
 * Get List of Drones From MongoDB
 */
exports.searchDrones = (req,res) => {
    res.render('search-drones');
}

exports.getDrones = async (req, res) => {
    const drones = await Drone.find(); // List all drones
    console.log(drones);
	res.render('drones', { title: 'Drones', drones });
};

/**
 * Render Add Drone Page
 */
exports.addDrone = (req,res) => {
    res.render('edit-drone',{title: '➕ Add Drone', status: 'Helper Page. Not for Production'});
}

/**
 * Insert Form Data to Drone
 */
exports.createDrone = async (req,res) => {
    const store = await new Drone(req.body).save();
    res.redirect(`drone/${drone.slug}`);
}

exports.confirmPayment = (req,res) => {
    res.render('confirm-payment');
}

exports.orderStatus = (req,res) => {
    res.render('order-status');
}