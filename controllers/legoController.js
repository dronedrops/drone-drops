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

wedo2.on('button', function(button, uuid) {
	console.log('button state: ' + button + ' @ ' + uuid);
	let speed = button ? 100 : 0;
	wedo2.setMotor(speed, 1, uuid);
});

wedo2.on('port', function(port, connected, type, uuid) {
	if (connected) {
		console.log('Found ' + type + ' on port ' + port + ' @ ' + uuid);
	} else {
		console.log('Disconnected ' + type + ' on port ' + port + ' @ ' + uuid);
	}
});

wedo2.on('disconnected', function(uuid) {
	console.log('I removed a WeDo with uuid: ' + uuid);
});
