'use strict';
var http = require('http');
var arDrone = require('ar-drone');
var http = require('http');
var PaVEParser = require('/Users/jerome/apps/hackathon/node-drone-drops/node_modules/ar-drone/lib/video/PaVEParser');
var output = require('fs').createWriteStream('./vid.h264');

exports.flyElite = function() {
    var client = arDrone.createClient();

    var server = http.createServer(function(req, res) {
        require("fs").createReadStream(__dirname + "/index.html").pipe(res);
    });

    console.log('Drone takeOff complete.');
    var client = arDrone.createClient();
    var video = client.getVideoStream();
    var parser = new PaVEParser();

    client.takeoff();

    console.log('Drone in transit.');
    parser
        .on('data', function(data) {
            output.write(data.payload);
        })
        .on('end', function() {
            output.end();
        });

    video.pipe(parser);

    client
        .after(4000, function() {
            this.up(0.10);
        })
        .after(2000, function() {
            this.back(0.10);
        })
        .after(1000, function() {
            this.stop();
            this.land();
        });
    console.log('complete.');

    server.listen(5555);
};

exports.dropPackage = function() {
    console.log('Step Forward Drone & Land');
};

exports.flyBack = function() {
    console.log('Reverse fly function');
}