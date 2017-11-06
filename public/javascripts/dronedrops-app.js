import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

import typeAhead from './modules/typeAhead';

// import '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader';

autocomplete($('#address'), $('#lat'), $('#lng'));
// autocompleteCoords($('#fromAddress'), $('#fromLongLat'));
// autocompleteCoords($('#toAddress'), $('#toLongLat'));

typeAhead( $('.search') );
