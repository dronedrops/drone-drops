'use strict';
var noble = require('noble');
var knownDevices = [];
var BEACON_BLE = 'dd9217ccd7424581adfec6d142420e51';
if (noble.state === 'poweredOn') {
    start();
} else {
    noble.on('stateChange', start);
}

function start() {
    noble.startScanning();
    noble.on('discover', function(peripheral) {
        var details = {
            name: peripheral.advertisement.localName,
            uuid: peripheral.uuid,
            rssi: peripheral.rssi
        };
        knownDevices.push(details);
        console.log(knownDevices.length + ': ' + details.name + ' (' + details.uuid + '), RSSI ' + details.rssi);
        if (peripheral.uuid === BEACON_BLE) {
            console.log('Open the door');
        } else {
            console.log('Close the door');
        }
    });
}