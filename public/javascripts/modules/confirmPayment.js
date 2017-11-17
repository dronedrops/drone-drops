import { $ } from './bling';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import metaCoinArtifacts from '../../../build/contracts/MetaCoin';
import transactionArtifacts from '../../../build/contracts/Transaction';

var accounts;
var account;
var order;
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

function confirmPayment() {
    init();
    console.log(`confirm Payment from account ${account}`);
    DroneDrops.deployed().then(function(instance) {
        var drone = instance.placeOrder(
            "ls101ea",
            "ls1010lj",
            123,
            accounts[1],
            accounts[2],
            accounts[3], {
                from: account,
                value: 50000000000000000,
                gas: 300000
            }
        );
        return drone;
    }).then(function(value) {
        console.log('Order created in the Blockchain!!!');
        console.log(value.valueOf());
        validateOpenOrder();
    }).catch(function(e) {
        console.log(e);
        console.log('Unable to create Order. Check above error.');
    });
}

function validateOpenOrder() {
    console.log(`validating order details ${accounts[3]}`);
    DroneDrops.deployed().then(function(instance) {
        var result = instance.validateOpenOrderStatus(123, accounts[3], {
            from: account,
            value: 0,
            gas: 300000
        });
        return result;
    }).then(function(value) {
        console.log('Order validated from the Blockchain!!!');
        console.log(value);
        updateOrderStatus();
    }).catch(function(e) {
        console.log('Unable to validate created Order', e);
    });
}

function updateOrderStatus() {
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

export default confirmPayment;