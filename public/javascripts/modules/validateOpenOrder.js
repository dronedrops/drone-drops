import { $ } from './bling';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import transactionArtifacts from '../../../build/contracts/Transaction';

var accounts;
var account;
var order;
var DroneDrops = TruffleContract(transactionArtifacts);

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

function validateOpenOrder() {
    init();
    console.log(`validating order details ${account}`);
    DroneDrops.deployed().then(function(instance) {
        var result = instance.validateOpenOrder(1, 123, accounts[3]);
        return result;
    }).then(function(value) {
        console.log('Order validated from the Blockchain!!!');
        console.log(value);
    }).catch(function(e) {
        console.log('Unable to validate created Order', e);
    });
}

function updateOrderStatus() {
    init();
    console.log(`Updating order details ${account}`);
    DroneDrops.deployed().then(function(instance) {
        var result = instance.validateOpenOrder(1, 123, accounts[3]);
        return result;
    }).then(function(value) {
        console.log('Order validated from the Blockchain!!!');
        console.log(value);
    }).catch(function(e) {
        console.log('Unable to validate created Order', e);
    });
}