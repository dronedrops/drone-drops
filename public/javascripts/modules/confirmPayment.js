import { $ } from './bling';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import metaCoinArtifacts from '../../../build/contracts/MetaCoin';

var accounts;
var account;
var MetaCoin = TruffleContract(metaCoinArtifacts);

function init() {

	MetaCoin.setProvider(web3.currentProvider);

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

function confirmPayment() {
	// Initiate placeOrder here.
	init();
	console.log('Confirm Payment Clicked');
}


/*
async placeOrder() { 
    try {
      let pickupFrom = "Fenchurch Street, London";
      let deliverTo = "Royal Exchange, London";
      let droneId = "123";
      let senderEth = web3.eth.accounts[1]; //0x7c5c40985b0f9e5fe69c02298a9482f429f7e725
      let droneEth = web3.eth.accounts[2]; //0xbf5e980c1444f86e07311c330c806cd6516b20c4
      let consumerEth = web3.eth.accounts[3]; //0x5e36edb1ba3d293932fc264c6d6afd389f024f39
      web3.eth.defaultAccount =  web3.eth.coinbase;

      const response = await fetch('../build/contracts/Transaction.json');
      const Transaction_JSON = await response.json();
      const Transaction = await TruffleContract(Transaction_JSON);
      Transaction.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

      let meta = await Transaction.deployed();
      let transactionStatus = await meta.placeOrder(pickupFrom, deliverTo, droneId, consumerEth, senderEth, droneEth,  {from: senderEth});
      console.log('transactionStatus - ', transactionStatus);
      // this.$.successToast.text = 'Transaction Complete';
      // this.$.successToast.open();

    } catch (error) {
      // this.$.errorToast.text = `Error: ${error.message}`;
      // this.$.errorToast.open();
      console.log(`Error: ${error.message}`);
    }
} */

export default confirmPayment;
