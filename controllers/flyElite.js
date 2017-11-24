'use strict';
var http = require('http');
var arDrone = require('ar-drone');
var http = require('http');
var PaVEParser = require('../node_modules/ar-drone/lib/video/PaVEParser');
var client = arDrone.createClient();

exports.flyElite = function() {
    console.log('Drone takeOff complete.');

    client.takeoff();

    console.log('Drone in transit.');

    client
        .after(5000, function() {
            this.up(0.10);
        })
        .after(2000, function() {
            this.front(0.10);
        })
        .after(1000, function() {
            this.stop();
            this.land();
        });
    console.log('complete.');
};

exports.dropPackage = function() {
    console.log('Step Forward Drone & Land');
};

exports.flyBack = function() {
    console.log('Reverse fly function');
}