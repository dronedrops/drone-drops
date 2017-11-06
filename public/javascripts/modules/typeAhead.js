import axios from 'axios';
import dompurify from 'dompurify';
const UP_KEY = 38;
const DOWN_KEY = 40;
const ENTER_KEY = 13;

function searchResultsHTML(drones) {
	return drones
		.map(drone => {
			return `
        <a href="/drone/${drone.slug}" class="search__result">
          <strong>${drone.name}</strong>
        </a>
      `;
		})
		.join('');
}

function typeAhead(search) {
	if (!search) return;
	const searchInput = search.querySelector('input[name="search"]');
	const searchResults = search.querySelector('.search__results');

	searchInput.on('input', function() {
		// if there is no value, quit it!
		if (!this.value) {
			searchResults.style.display = 'none';
			return; // stop!
		}

		// show the search results!
		searchResults.style.display = 'block';

		axios
			.get(`/api/search?q=${this.value}`)
			.then(res => {
				if (res.data.length) {
					searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
					return;
				}
				// tell nothing came back
				searchResults.innerHTML = dompurify.sanitize(`<div class="search__result"> ⚠️ No results for ${this.value}</div>`);
			})
			.catch(err => {
				console.error(err);
			});
	});

	// handle keyboard inputs
	searchInput.on('keyup', e => {
		// if they aren't pressing up(38), down(40) or enter(13), who cares!

		if (![UP_KEY, DOWN_KEY, ENTER_KEY].includes(e.keyCode)) {
			return; // அப்பாலே போ சாத்தானே !
		}
		const activeClass = 'search__result--active';
		const current = search.querySelector(`.${activeClass}`);
		const items = search.querySelectorAll('.search__result');
		let next;
		if (e.keyCode === DOWN_KEY && current) {
			next = current.nextElementSibling || items[0];
		} else if (e.keyCode === DOWN_KEY) {
			next = items[0];
		} else if (e.keyCode === UP_KEY && current) {
			next = current.previousElementSibling || items[items.length - 1];
		} else if (e.keyCode === UP_KEY) {
			next = items[items.length - 1];
		} else if (e.keyCode === ENTER_KEY && current.href) {
			window.location = current.href;
			return;
		}
		if (current) {
			current.classList.remove(activeClass);
		}
		next.classList.add(activeClass);
	});
}

export default typeAhead;
