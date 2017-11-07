import axios from "axios";
import { $ } from './bling';

const mapOptions = {
    center: { lat:51.5136799, lng: -0.0865300000000388},
    zoom: 10
}

function loadPickUpPoints(map, lat = 51.5136799, lng = -0.08653000000003885) {
    axios.get(`/api/drones/near?lat=${lat}&lng=${lng}`)
        .then(res => {
            const drones = res.data;
            if(!drones.length) {
                console.log('no drones found!');
                return;
            }

            // create bounds
            const bounds = new google.maps.LatLngBounds();
            const infoWindow = new google.maps.InfoWindow();

            const markers = drones.map(drone => {
                const [droneLng, droneLat] = drone.location.coordinates;
                const position = { lat: droneLat, lng: droneLng};
                bounds.extend(position);
                const marker = new google.maps.Marker({map, position});
                marker.place = drone;
                return marker;
            });

            // when click on the marker, show the details of the drone
            markers.forEach(marker => marker.addListener('click', function(){
                const html = `
                    <div class="popup">
                        <a href="/drone/${this.place.slug}">
                            <img src="/uploads/${this.place.photo || 'drone.png'}" alt="${this.place.name}" />
                            <p>${this.place.name} - ${this.place.location.address}</p>
                        </a>
                    </div>
                    `;
                infoWindow.setContent(html);
                infoWindow.open(map, this);
            }));

            // zoom the map to bounds.
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        });
}

function renderMap(mapDiv) {
    if(!mapDiv) return;
    let fromLat = $('#fromLat').value;
    let fromLng = $('#fromLng').value;
    let fromAddress = $('#fromAddress').value;
    let errMsg = $('#searchDroneErr');
    if(fromAddress && fromLat && fromLng) {
        clearErrors(errMsg);
        const map = new google.maps.Map(mapDiv, mapOptions);
        loadPickUpPoints(map, fromLat, fromLng);
    } else {
        showErrors(errMsg);
    }
}

function showErrors(errMsg) {
    errMsg.removeAttribute('hidden');
}

function clearErrors(errMsg) {
    if(!errMsg.hasAttribute('hidden')) {
        errMsg.setAttribute('hidden', true);
    }
}

export default renderMap;