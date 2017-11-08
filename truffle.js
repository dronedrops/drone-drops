// Allows us to use ES6 in our migrations and tests.
require('babel-register');

module.exports = {
	networks: {
		development: {
			host: 'localhost',
			port: 8545,
			gas: 2900000,
			gaslimit: 5900000,
			network_id: '*' // Match any network id
		},
		aws: {
			host: 'http://52.15.181.237',
			port: 8545,
			network_id: '*' // Match any network id
		}
	}
};
