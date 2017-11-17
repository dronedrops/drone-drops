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

function updateOrderStatus() {
    init();
    console.log(`Updating order details ${accounts[3]}`);
    DroneDrops.deployed().then(function(instance) {
        var result = instance.updateOrderStatus(1, '123', accounts[1], {
            from: accounts[1],
            value: 50000000000000000,
            gas: 300000
        });
        return result;
    }).then(function(value) {
        console.log('Order updated at the Blockchain!!!');
        console.log(value);
    }).catch(function(e) {
        console.log('Unable to update Order', e);
    });
}