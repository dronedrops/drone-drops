// All Front-End logic modules goes here.
import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import renderMap from './modules/nearByDrone';
import confirmPayment from './modules/confirmPayment';

// import '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader';

import io from 'socket.io-client';
var socket = io.connect('http://localhost:5454');

let droneFlash = $('#droneFlash');
let droneMsg = $('#droneMsg');


socket.on('news', function(data) {
	console.log(data);
	droneMsg.innerText = `${data.time} - ${data.message}`;
	showErrors(droneFlash);
});

autocomplete($('#address'), $('#lat'), $('#lng'));
autocomplete($('#fromAddress'), $('#fromLat'), $('#fromLng'));
autocomplete($('#toAddress'), $('#toLat'), $('#toLng'));

typeAhead($('.search'));

if ($('#searchDrones')) {
	$('#searchDrones').on('click', function() {
		renderMap($('#map'));
	});
}

if ($('#confirmPayment')) {
	$('#confirmPayment').on('click', function(e) {
		e.preventDefault();
		confirmPayment();
	});
}

window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
		console.warn(
			"Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask"
		);
		// Use Mist/MetaMask's provider
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.warn(
			"No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
		);
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
	}
});

function showErrors(msg) {
	msg.removeAttribute('hidden');
}

function clearErrors(msg) {
	if (!msg.hasAttribute('hidden')) {
		msg.setAttribute('hidden', true);
	}
}
