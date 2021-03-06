var Wedo2 = require('wedo2');
var wedo2 = new Wedo2('LPF2');
var identifyDrone = require('./identifyDrone');
var flyMambo = require('./flyMambo');
var request = require('request');
const axios = require('axios');

var consumerEth = '0x14723a09acff6d2a60dcdf7aa4aff308fddc160c';
var deliverToPostCode = 'LS101EA';
var API_BASE_URL = 'http://localhost:7777/api';

async function emitMessage(message, element) {
	try {
		let emitStatus = await axios(`${API_BASE_URL}/emitMessage?message=${message}&element=${element}`);
	} catch (error) {
		console.error(`${message} - Status: `, error);
	}
}

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

async function getOpenOrderId(droneUUID, consumerEth) {
    try {
        console.log('Inside getOpenOrderId -- droneUUID', droneUUID, consumerEth);
        let orderStatus = await axios(`${API_BASE_URL}/validateOrder?droneId=${droneUUID}&consumerEth=${consumerEth}`);
        let orderId = await orderStatus.data.orderId;
        console.log('legoController - getOpenOrderId', orderId);
        return orderId;
    } catch (error) {
        console.error(error);
    }
}

async function updateOrderStatus(orderId, droneUUID) {
    try {
        let updateOrderStatus = await axios(
            `${API_BASE_URL}/updateOrderStatus?orderId=${orderId}&droneId=${droneUUID}&consumerEth=${consumerEth}&deliverToPostCode=${deliverToPostCode}`
        );
        console.log('orderStatus', updateOrderStatus.data.orderStatus);
    } catch (error) {
        console.error(error);
    }
}

function closeDoor() {
    //TODO: console.log('Close the door');
}

wedo2.on('distanceSensor', async function(distance, port, uuid) {
    console.log('distanceSensor: ' + distance + ' at port ' + port + ' @ ' + uuid);
    if (distance < 10) {
        let droneUuid = identifyDrone.scanBleDevices() || 'dd9217ccd7424581adfec6d142420e51';
        let orderId = await getOpenOrderId(droneUuid, consumerEth);
        if (orderId > 0) {
            console.log('Inside Valid Order ID', orderId);
            emitMessage('Drone Verified', 'droneVerified');
            openDoor(uuid);
            emitMessage('Package Delivered', 'packageDelivered');
            // await delay(4000);
            updateOrderStatus(orderId, droneUuid);
            emitMessage('Payment Settled', 'paymentSettled');
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