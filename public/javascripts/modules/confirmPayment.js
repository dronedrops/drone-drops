import { $ } from './bling';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import transactionArtifacts from '../../../build/contracts/Transaction';

var accounts;
var account;
var DroneDrops = TruffleContract(transactionArtifacts);
const DRONE_ID = '123';
const CONSUMER_ETH = '0x14723a09acff6d2a60dcdf7aa4aff308fddc160c';
function init() {
	DroneDrops.setProvider(web3.currentProvider);

	web3.eth.getAccounts(function(err, accs) {
		if (err != null) {
			alert('There was an error fetching your accounts.');
			return;
		}

		if (accs.length == 0) {
			alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
			return;
		}

		accounts = accs;
		account = accounts[0];
		console.log(account);
	});
}

function confirmPayment() {
	init();
	let errMsg = $('#confirmPaymentErr');
	clearErrors(errMsg);
	DroneDrops.deployed()
		.then(function(instance) {
			var drone = instance.placeOrder(
				'ls101ea',
				'ls1010lj',
				DRONE_ID,
				CONSUMER_ETH,
				'0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db',
				'0x583031d1113ad414f02576bd6afabfb302140225',
				{
					from: account,
					value: 50000000000000000,
					gas: 300000
				}
			);
			return drone;
		})
		.then(function(value) {
			console.log('Order created in the Blockchain!!!');
			console.log(value.valueOf());
			// TODO: 1. call API to make the drones fly.
			// TODO: 2. updateStatus('Order Picked Up');
		})
		.catch(function(e) {
			console.error(e);
			console.error('Unable to create Order. Check above error.');
			showErrors(errMsg);
		});
}

function showErrors(errMsg) {
	errMsg.removeAttribute('hidden');
}

function clearErrors(errMsg) {
	if (!errMsg.hasAttribute('hidden')) {
		errMsg.setAttribute('hidden', true);
	}
}

function validateOpenOrder() {
	console.log(`validating order details ${accounts[3]}`);
	DroneDrops.deployed()
		.then(function(instance) {
			var result = instance.validateOpenOrderStatus.call(DRONE_ID, CONSUMER_ETH, {
				from: account,
				value: 0,
				gas: 300000
			});
			return result;
		})
		.then(function(value) {
			console.log('Order validated from the Blockchain!!!');
			console.log(value.valueOf());
			updateOrderStatus();
		})
		.catch(function(e) {
			console.log('Unable to validate created Order', e);
		});
}

function updateOrderStatus() {
	console.log(`Updating order details ${accounts[3]}`);
	DroneDrops.deployed()
		.then(function(instance) {
			var result = instance.updateOrderStatus.call(15, DRONE_ID, CONSUMER_ETH, 'ls101ea', {
				from: account,
				value: 0,
				gas: 300000
			});
			return result;
		})
		.then(function(value) {
			console.log('Order updated at the Blockchain!!!');
			console.log(value.valueOf());
			res.render('order-status');
		})
		.catch(function(e) {
			console.log('Unable to update Order', e);
		});
}

export default confirmPayment;
