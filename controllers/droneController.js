const mongoose = require('mongoose');
const Drone = mongoose.model('Drone');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const Web3 = require('web3');
const contract = require('truffle-contract');
const mambo = require('./flyMambo');
const elite = require('./flyElite');

const fs = require('fs');
const fsdata = fs.readFileSync('build/contracts/Transaction.json', 'utf8');
const Transaction_json = JSON.parse(fsdata);
const DroneOrderTransaction = contract(Transaction_json);
DroneOrderTransaction.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

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

exports.resize = async(req, res, next) => {
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

exports.renderSearchDrone = (req, res) => {
    res.render('search-drones', { title: 'Search Drones' });
};

exports.confirmPayment = (req, res) => {
    //TODO
    res.render('confirm-payment');
};


/** Helper Routers. For Dev purpose only. */

// Render Drone Form in addMode
exports.renderAddDrone = (req, res) => {
    res.render('edit-drone', { title: '➕ Add Drone', status: 'Helper Page. Not for Production' });
};

// Insert new drone into DB
exports.createDrone = async(req, res) => {
    const drone = await new Drone(req.body).save();
    req.flash('success', `Successfully Created ${drone.name}.`);
    res.redirect(`drone/${drone.slug}`);
};

// Render Drone Form in Edit Mode
exports.renderEditDrone = async(req, res) => {
    const drone = await Drone.findOne({ _id: req.params.id });
    res.render('edit-drone', { title: `Edit ${drone.name}`, drone });
};

exports.updateDrone = async(req, res) => {
    // 0. set location to Point
    req.body.location.type = 'Point';
    // 1. find & update the drone
    const drone = await Drone.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return the new drone instead of old one
        runValidators: true
    }).exec();

    // 2. Redirect to the drone and tell it worked.
    req.flash('success', `Successfully updated <strong>${drone.name}</strong>. <a href='/drones/${drone.slug}'> View Drone </a>`);
    res.redirect(`/drones/${drone._id}/edit`);
};

exports.getDrones = async(req, res) => {
    const drones = await Drone.find(); // List all drones
    res.render('drones', { title: 'Drones', drones });
};

exports.getDroneBySlug = async(req, res, next) => {
    const drone = await Drone.findOne({ slug: req.params.slug });
    if (!drone) return next();
    res.render('drone', { drone, title: drone.name, pickupFrom: req.query.pickupFrom });
};

/* API routes */
exports.searchDrones = async(req, res) => {
    const drones = await Drone.find({
            $text: {
                $search: req.query.q
            }
        }, {
            score: {
                $meta: 'textScore'
            }
        })
        .sort({
            score: { $meta: 'textScore' }
        })
        .limit(3);
    res.json(drones);
};

exports.findNearbyDrones = async(req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const query = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 // 10km
            }
        }
    };

    const drones = await Drone.find(query).select('slug name location photo');
    res.json(drones);
};

exports.validateOrder = async(req, res, next) => {
    let orderId = await getOrderId(req, res, next);
    res.json({ orderId });
};

async function getOrderId(req, res, next) {
    let droneDrop = await DroneOrderTransaction.deployed();
    let orderStatus = await droneDrop.validateOpenOrderStatus.call(req.query.droneId, req.query.consumerEth, {
        from: req.query.consumerEth,
        value: 0,
        gas: 300000
    });
    return orderStatus.valueOf();
}

exports.getOrderStatus = async(req, res, next) => {
    let orderId = await getOrderId(req, res, next);
    mambo.fly();
    res.render('order-status', { title: 'Order Status', orderId });
};

exports.updateOrderStatus = async(req, res) => {
    DroneOrderTransaction.deployed()
        .then(function(instance) {
            var result = instance.updateOrderStatus.call(
                req.query.orderId,
                req.query.droneId,
                req.query.consumerEth,
                req.query.deliverToPostCode, {
                    from: req.query.consumerEth,
                    value: 0,
                    gas: 300000
                }
            );
            return result;
        })
        .then(function(value) {
            console.log('Order updated at the Blockchain!!!');
            console.log(value.valueOf());
            let orderId = value.valueOf();
            req.flash('success', `Order Closed.`);
            res.render('order-status', { title: 'Order Status' });
        })
        .catch(function(e) {
            console.log('Unable to update Order', e);
        });
};

exports.asyncUpdateOrderStatus = async(req, res) => {
    let droneDrop = await DroneOrderTransaction.deployed();
    let updateOrderStatus = await droneDrop.updateOrderStatus.call(
        req.query.orderId,
        req.query.droneId,
        req.query.consumerEth,
        req.query.deliverToPostCode, {
            from: req.query.consumerEth,
            value: 0,
            gas: 300000
        }
    );
    let orderStatus = updateOrderStatus.valueOf();
    req.flash('success', `Order Closed.`);
    res.render('order-status', { title: 'Order Status' });
};

exports.flyElite = async(req, res) => {
    elite.flyElite();
    res.json({ elite: 'flying' });
};

exports.flyMambo = async(req, res) => {
    mambo.fly();
    res.json({ mambo: 'flying' });
};