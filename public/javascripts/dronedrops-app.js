// All Front-End logic modules goes here.
import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import renderMap from './modules/nearByDrone';

// import '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader';

autocomplete($('#address'), $('#lat'), $('#lng'));
autocomplete($('#fromAddress'), $('#fromLat'), $('#fromLng'));
autocomplete($('#toAddress'), $('#toLat'), $('#toLng'));

typeAhead($('.search'));

if ($('#searchDrones')) {
	$('#searchDrones').on('click', function() {
		renderMap($('#map'));
	});
}
