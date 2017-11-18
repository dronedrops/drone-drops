var Wedo2 = require('WeDo2');
var wedo2 = new Wedo2('LPF2');
var identifyDrone = require('./identifyDrone');
var flyMambo = require('./flyMambo');
var request = require('request');

var consumerEth = '0x14723a09acff6d2a60dcdf7aa4aff308fddc160c';
var deliverToPostCode = 'LS101EA';

wedo2.on('connected', function(uuid) {
	console.log('I found a WeDo with uuid: ' + uuid);
	// Place getters and setters in here, to make sure that they are called,
	// when the object is connected
	wedo2.getDeviceName(function(name, uuid) {
		console.log('the device name is ' + name + ' @ ' + uuid);
	}, uuid);
});

wedo2.on('battery', function(status, uuid) {
	console.log('Battery: ' + status + '% @ ' + uuid);
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function openDoor(uuid) {
	console.log('this might take some time....');
	wedo2.setMotor(100, 1, uuid);
	await delay(4000);
	console.log('done!');
	wedo2.setMotor(0, 1, uuid);
}

function getOpenOrderId(droneUuid, consumerEth) {
	// http://localhost:7777/api/validateOrder?droneId=123&consumerEth=0x6fc532b497073b0f0c612a369beea7d541538a58
	// return api.response;
	request(`http://localhost:7777/api/validateOrder?droneId=${droneUuid}&consumerEth=${consumerEth}`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // Print the google web page.
		 }
	});
	
}

function updateOrderStatus(orderId, droneUuid) {
	// http://localhost:7777/api/updateOrderStatus?orderId=20&droneId=456&consumerEth=0x6fc532b497073b0f0c612a369beea7d541538a58&deliverToPostCode=ls101ea
}

function closeDoor() {
	console.log('Close the door');
}

wedo2.on('distanceSensor', function(distance, port, uuid) {
	console.log('distanceSensor: ' + distance + ' at port ' + port + ' @ ' + uuid);
	if (distance < 10) {
		let droneUuid = identifyDrone.scanBleDevices();
		let orderId = getOpenOrderId(droneUuid, consumerEth);
		if (ordeId > 0) {
			openDoor(uuid);
			updateOrderStatus(ordeId, droneUuid);
			flyMambo.dropPackage();
			flyMambo.flyBack();
			closeDoor();
		} else {
			// TODO: Add Danger Sound or RED LED
			// TODO: Escrow Managment - Release the money.
			flyMambo.flyBack();
		}
	}
});

wedo2.on('port', function(port, connected, type, uuid) {
	if (connected && getOpenOrderId() > 0) {
		console.log('Found ' + type + ' on port ' + port + ' @ ' + uuid);
		openDoor(uuid);
	} else {
		console.log('Disconnected ' + type + ' on port ' + port + ' @ ' + uuid);
	}
});

wedo2.on('disconnected', function(uuid) {
	console.log('I removed a WeDo with uuid: ' + uuid);
});
