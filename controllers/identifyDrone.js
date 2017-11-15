// npm install rolling-spider
// npm install noble

'use strict';

var Drone = require('rolling-spider');
var noble = require('noble');
var knownDevices = [];
var THIRU_MAMBO = 'dd9217ccd7424581adfec6d142420e51';
if (noble.state === 'poweredOn') {
	start();
} else {
	noble.on('stateChange', start);
}

function start() {
	noble.startScanning();

	noble.on('discover', function(peripheral) {
		if (!Drone.isDronePeripheral(peripheral)) {
			return; // not a drone
		}
		var details = {
			name: peripheral.advertisement.localName,
			uuid: peripheral.uuid,
			rssi: peripheral.rssi
		};

		knownDevices.push(details);
		console.log(knownDevices.length + ': ' + details.name + ' (' + details.uuid + '), RSSI ' + details.rssi);
		if (peripheral.uuid === THIRU_MAMBO) {
			console.log('Open the door');
		} else {
			console.log('Close the door');
		}
	});
}

// 1: Mambo_539489 (7a6f382e020c4a2ebf3d004c34ffde61), RSSI -57