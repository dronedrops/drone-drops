import { $ } from './bling';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import metaCoinArtifacts from '../../../build/contracts/MetaCoin';
import transactionArtifacts from '../../../build/contracts/Transaction';

var accounts;
var account;
var MetaCoin = TruffleContract(metaCoinArtifacts);
var DroneDrops = TruffleContract(transactionArtifacts);

function init() {

	MetaCoin.setProvider(web3.currentProvider);
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
		refreshBalance();
	});
}

async function refreshBalance() {
	try {
		let meta = await MetaCoin.deployed();
		let balance = await meta.getBalance.call(web3.eth.accounts[0]);
		console.log(balance.valueOf());
	} catch (error) {
		console.log(`Error: ${error.message}`);
	}
}

function placeOrder() {
	console.log('Initiate Order');
}

function confirmPayment(){
	init();

	console.log(`confirm Payment from account ${account}`);
	DroneDrops.deployed().then(function(instance) {
		var drone = instance.placeOrder(
			"ls101ea", 
			"ls1010lj",
			123,
			"0x14723a09acff6d2a60dcdf7aa4aff308fddc160c",
			"0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db",
			"0x583031d1113ad414f02576bd6afabfb302140225",
			{ 
				from: account,
				value: 50000000000000000,
				gas: 300000
			}
		);
		return drone;
	  }).then(function(value) {
		console.log('Order created in the Blockchain!!!');
		console.log(value.valueOf());
	  }).catch(function(e) {
		console.log(e);
		console.log('Unable to create Order. Check above error.');
	  });
}

export default confirmPayment;
