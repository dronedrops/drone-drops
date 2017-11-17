'use strict';

const RollingSpider = require('rolling-spider');
const temporal = require('temporal');
const rollingSpider = new RollingSpider();


exports.fly = function() {
	console.log('Fly Mambo');
	rollingSpider.connect(function() {
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
					}
				},
				{
					delay: 5000,
					task: function() {
						rollingSpider.forward();
					}
				},
				{
					delay: 5000,
					task: function() {
						rollingSpider.land();
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
