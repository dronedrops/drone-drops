import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
// import '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader';

autocomplete($('#address'), $('#lat'), $('#lng'));