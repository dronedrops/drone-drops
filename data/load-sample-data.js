require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Drone = require('../models/DroneSchema');

const drones = JSON.parse(fs.readFileSync(__dirname + '/drones.json', 'utf-8'));

async function deleteData() {
	console.log('😢 😢 Goodbye Data...');
	await Drone.remove();
	console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
	process.exit();
}

async function loadData() {
	try {
		await Drone.insertMany(drones);
		console.log('👍 👍 👍  Imported Drones! 👍 👍 👍 ');
		process.exit();
	} catch (e) {
		console.log(
			'\n👎 👎 👎  Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
		);
		console.log(e);
		process.exit();
	}
}
if (process.argv.includes('--delete')) {
	deleteData();
} else {
	loadData();
}
