const mongoose = require('mongoose');
const Drone = mongoose.model('Drone');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

/* helper for Image Uploading */
const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: 'That file type is not allowed!' }, false);
		}
	}
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	// check if there is no new file
	if (!req.file) {
		next(); // skip to next middleware
		return;
	}
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	// resize the photo
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	next();
};

exports.landing = (req, res) => {
	res.render('landing', { title: 'Home' });
};

exports.searchDrones = (req, res) => {
	res.render('search-drones');
};

exports.confirmPayment = (req, res) => {
	res.render('confirm-payment');
};

exports.orderStatus = (req, res) => {
	res.render('order-status');
};

exports.ethDemo = (req, res) => {
	res.render('eth-demo');
};

/** Helper Routers. For Dev purpose only. */

// Render Drone Form in addMode
exports.renderAddDrone = (req, res) => {
	res.render('edit-drone', { title: '➕ Add Drone', status: 'Helper Page. Not for Production' });
};

// Insert new drone into DB
exports.createDrone = async (req, res) => {
	const drone = await new Drone(req.body).save();
	req.flash('success', `Successfully Created ${drone.name}.`);
	res.redirect(`drone/${drone.slug}`);
};

// Render Drone Form in Edit Mode 
exports.renderEditDrone = async (req, res) => {
	const drone = await Drone.findOne({ _id: req.params.id });
	res.render('edit-drone', { title: `Edit ${drone.name}`, drone });
};

exports.updateDrone = async (req, res) => {
	// 0. set location to Point
	req.body.location.type = 'point';
	// 1. find & update the drone
	const drone = await Drone.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // return the new drone instead of old one
		runValidators: true
	}).exec();

	// 2. Redirect to the drone and tell it worked.
	req.flash('success', `Successfully updated <strong>${drone.name}</strong>. <a href='/drones/${drone.slug}'> View Drone </a>`);
	res.redirect(`/drones/${drone._id}/edit`);
};

exports.getDrones = async (req, res) => {
	const drones = await Drone.find(); // List all drones
	res.render('drones', { title: 'Drones', drones });
};
