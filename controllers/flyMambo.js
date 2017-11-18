'use strict';

const RollingSpider = require('rolling-spider');
const temporal = require('temporal');
const rollingSpider = new RollingSpider();


exports.fly = function() {
	console.log('Fly Mambo');
	rollingSpider.connect(function() {
		console.log('Connected To Mambo');
		rollingSpider.setup(function() {
			rollingSpider.flatTrim();
			rollingSpider.startPing();
			rollingSpider.flatTrim();

			temporal.queue([
				{
					delay: 5000,
					task: function() {
						rollingSpider.takeOff();
						rollingSpider.flatTrim();
						console.log('Mambo Took Off');
					}
				},
				{
					delay: 5000,
					task: function() {
						rollingSpider.forward();
						console.log('Mambo In Transit');
						
					}
				},
				{
					delay: 5000,
					task: function() {
						rollingSpider.land();
						console.log('Mambo Landed');
					}
				},
				{
					delay: 5000,
					task: function() {
						temporal.clear();
						process.exit(0);
					}
				}
			]);
		});
	});
};

exports.dropPackage = function() {
	console.log('Step Forward Drone & Land');
};

exports.flyBack = function() {
	console.log('Reverse fly function');
}
