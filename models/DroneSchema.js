const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use ES6 Promise
const slug = require('slugs'); // URL friendly names 

const droneSchema = new mongoose.Schema({
	droneEthAccount: {
		type: String,
		trim: true,
		required: 'Please enter account Id from TestRPC!'
	},
	name: {
		type: String,
		trim: true,
		required: 'Please enter a Drone name!'
	},
	droneId: {
		type: String,
		trim: true,
		required: 'Please enter drone Id. e.g.Mambo-0702!'
	},
	capacity: {
		type: Number,
		required: 'Please enter capacity(max.weight Drone can carry) in lbs'
	},
	flightHours: {
		type: String,
		trim: true,
		required: 'Please enter flight hours. e.g.10 Hrs!'
	},
	eth: {
		type: Number,
		required: 'Please enter ETH amount'
	},
	gps: {
		type: String,
		required: "Please enter Yes or No"
	},
	camera: {
		type: String,
		required: "Please enter Yes or No"
	},
	liveStreaming: {
		type: String,
		required: "Please enter Yes or No"
	},
	location: {
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [
			{
				type: Number,
				required: 'You must supply coordinates!'
			}
		],
		address: {
			type: String,
			required: 'You must supply an address!'
		}
	},
	photo: String,
	slug: String,
	created: {
		type: Date,
		default: Date.now
	}
});


// Define our indexes
droneSchema.index({
	name: 'text'
  });
  
droneSchema.index({ location: '2dsphere' });

droneSchema.pre('save', async function(next) {
	if (!this.isModified('name')) {
		next(); //skip it
		return; // stop this function from running
	}
	this.slug = slug(this.name);
	// find duplicate slug
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)`, 'i');
	const dronesWithSlug = await this.constructor.find({ slug: slugRegEx });
	if (dronesWithSlug.length) {
		this.slug = `${this.slug}-${dronesWithSlug.length + 1}`;
	}
	next();
});

module.exports = mongoose.model('Drone', droneSchema);
