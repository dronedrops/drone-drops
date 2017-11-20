import { $ } from './bling';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import transactionArtifacts from '../../../build/contracts/Transaction';

var accounts;
var senderEthAccount;
var DroneDrops = TruffleContract(transactionArtifacts);
const DRONE_ID = '123';
const CONSUMER_ETH = '0x14723a09acff6d2a60dcdf7aa4aff308fddc160c';
const DRONE_ETH = '0xb0c1c8da43a833006903227c4ef1f4da20dc469f';

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
        senderEthAccount = accounts[0];
        console.log(senderEthAccount);
    });
}

function confirmPayment() {
    init();
    let errMsg = $('#confirmPaymentErr');
    let urlParams = getUrlVars();
    clearErrors(errMsg);
    DroneDrops.deployed()
        .then(function(instance) {
            var drone = instance.placeOrder(
                urlParams['pickupFrom'],
                urlParams['destination'],
                DRONE_ID,
                CONSUMER_ETH,
                senderEthAccount,
                DRONE_ETH, {
                    from: senderEthAccount,
                    value: calculatePaymentInWei(),
                    gas: 300000
                }
            );
            return drone;
        })
        .then(function(value) {
            console.log('Order created in the Blockchain!!!');
            console.log('Tx Ref', value.valueOf());
            $('#placeOrderForm').submit();
            // TODO: updateStatus('Order Picked Up');
        })
        .catch(function(e) {
            console.error(e);
            console.error('Unable to create Order. Check above error.');
            showErrors(errMsg);
        });
}

function calculatePaymentInWei(){
    var eth = $('#droneEth').innerText;
    return web3.toWei(eth, 'ether');
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
                from: accounts[0],
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
    checkAllBalances();
    DroneDrops.deployed()
        .then(function(instance) {
            var result = instance.updateOrderStatus.call(DRONE_ID, CONSUMER_ETH, 'ls101ea', {
                from: accounts[0],
                value: 0,
                gas: 300000
            });
            return result;
        })
        .then(function(value) {
            console.log('Order updated at the Blockchain!!!');
            console.log(value.valueOf());
            //res.render('order-status');
        }).then(function(value) {
            console.log('Order updated at the Blockchain!!!');
            //res.render('order-status');
            checkAllBalances();
        }).
    catch(function(e) {
        console.log('Unable to update Order', e);
    });
}

function checkAllBalances() {
    var i = 0;
    accounts.forEach(function(e) {
        console.log("  accounts[" + i + "]: " + e + " \tbalance: " + web3.fromWei(web3.eth.getBalance(e), "ether") + " ether");
        i++;
    })
}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

export default confirmPayment;