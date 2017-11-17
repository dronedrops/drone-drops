var Wedo2 = require('WeDo2');
var wedo2 = new Wedo2('LPF2');
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

async function runMotorAndStop(uuid) {
	console.log('this might take some time....');
	wedo2.setMotor(100, 1, uuid);
	await delay(4000);
	console.log('done!');
	wedo2.setMotor(0, 1, uuid);
}

wedo2.on('port', function(port, connected, type, uuid) {
	if (connected) {
		console.log('Found ' + type + ' on port ' + port + ' @ ' + uuid);
		//TODO: RxJS Based Observable API.
		//TODO: If(validOrder) { runMotorAndStop();}
		runMotorAndStop(uuid);
	} else {
		console.log('Disconnected ' + type + ' on port ' + port + ' @ ' + uuid);
	}
});

wedo2.on('disconnected', function(uuid) {
	console.log('I removed a WeDo with uuid: ' + uuid);
});
