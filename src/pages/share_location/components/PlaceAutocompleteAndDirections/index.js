import React from 'react';
import ConnectApiMaps, { Map } from 'maps-google-react';
import PropTypes from 'prop-types';
// import { dateTime } from '../../../../model/dateTime';
import './styles/place-autocomplete-and-directions.css';
import Loading from '../../../loading';


function PlaceAutocompleteAndDirections(props) {

    const [originRoute, setOriginRoute] = React.useState()
    const [destinationRoute, setDestinationRoute] = React.useState()
    const originSearchInput = React.useRef(null);
    const destinationSearchInput = React.useRef(null);

    // const socket = io(`http://localhost:8080/`);

    /**
     * @constructor
     */
    function AutocompleteDirectionsHandler(google, map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        this.directionsService = new window.google.maps.DirectionsService;
        this.directionsRenderer = new window.google.maps.DirectionsRenderer;
        this.directionsRenderer.setMap(map);

        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        var modeSelector = document.getElementById('mode-selector');

        originInput.style.position = "relative";
        originInput.style.top = "50px";
        originInput.style.left = "0px";

        var originAutocomplete = new window.google.maps.places.Autocomplete(originInput);
        // Specify just the place data fields that you need.
        originAutocomplete.setFields(['place_id']);

        var destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInput);
        // Specify just the place data fields that you need.
        destinationAutocomplete.setFields(['place_id']);

        this.setupClickListener('changemode-walking', 'WALKING');
        this.setupClickListener('changemode-transit', 'TRANSIT');
        this.setupClickListener('changemode-driving', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[window.google.maps.ControlPosition.LEFT_TOP].push(destinationInput);
        this.map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(modeSelector);
    }

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    AutocompleteDirectionsHandler.prototype.setupClickListener = function (
        id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;

        radioButton.addEventListener('click', function () {
            me.travelMode = mode;
            me.route();
        });
    };

    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (
        autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);

        autocomplete.addListener('place_changed', function () {

            var place = autocomplete.getPlace();

            console.log(place);

            if (!place.place_id) {

                alert('Please select an option from the dropdown list.');

                return;
            };

            if (mode === 'ORIG') {

                me.originPlaceId = place.place_id;

            } else {

                me.destinationPlaceId = place.place_id;

            };

            me.route();

        });
    };

    AutocompleteDirectionsHandler.prototype.route = function () {

        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        };

        var me = this;

        this.directionsService.route(
            {
                origin: { 'placeId': this.originPlaceId },
                destination: { 'placeId': this.destinationPlaceId },
                travelMode: this.travelMode
            },
            function (response, status) {

                if (status === 'OK') {

                    me.directionsRenderer.setDirections(response);

                    console.log(response);
                    // socket.emit('origin_destination_route', response)
                    const res = JSON.stringify(response);

                    props.db.firestore().collection(`share`).doc(props.isAuth.uid).set({
                        location: {
                            request: response.request,
                            distance: response.routes[0].legs[0].distance,
                            duration: response.routes[0].legs[0].duration,
                            end_address: response.routes[0].legs[0].end_address,
                            end_location: {
                                lat: response.routes[0].legs[0].end_location.lat(),
                                lng: response.routes[0].legs[0].end_location.lng(),
                            },
                            start_address: response.routes[0].legs[0].start_address,
                            start_location: {
                                lat: response.routes[0].legs[0].start_location.lat(),
                                lng: response.routes[0].legs[0].start_location.lng(),
                            },
                        }
                    }).then(() => {

                        console.log('สร้าง locationc ขึ้นมาใหม่ 😁');

                    });

                    console.log(response);

                } else {

                };

            });

    };


    function originRouteUpdate(e) {

        setOriginRoute(e.target.value);

    };

    function destinationRouteUpdate(e) {

        setDestinationRoute(e.target.value);

    };

    // function onFocusOrigin() {
    //     originSearchInput.value = ''
    // }

    // function onFocusDestination() {
    //     destinationSearchInput.value = ''
    // }

    return (
        <React.Fragment>
            {props.isAuth !== null
                ? (<Map google={props.google}
                    setStyle={{
                        marginTop: '100px',
                        position: "absolute",
                        overflow: "hidden",
                        height: (window.innerHeight - 100),
                        width: "100%",
                    }}
                    mapOptions={{
                        zoom: 15,
                        center: { lat: -33.8688, lng: 151.2195 },
                        disableDefaultUI: true,
                        styles: [{
                            featureType: 'poi.business',
                            stylers: [{ visibility: 'on' }]
                        },
                        {
                            featureType: 'transit',
                            elementType: 'labels.icon',
                            stylers: [{ visibility: 'off' }]
                        }]
                    }}
                    opts={(google, map) => {
                        // initMap(google, map)
                        //    setGoogle(google);
                        //    setMap(map)
                        console.log();

                        new AutocompleteDirectionsHandler(google, map);
                    }}
                >
                    <div style={{ display: 'block' }}>
                        <input
                            ref={originSearchInput}
                            onChange={originRouteUpdate}
                            // onFocus={onFocusOrigin}
                            id="origin-input"
                            className="controls"
                            type="text"
                            placeholder="ต้นทาง"
                            style={{
                                zIndex: 0,
                                position: 'relative',
                                top: '50px',
                                borderRadius: '8px',
                            }}
                        />
                        <input
                            ref={destinationSearchInput}
                            onChange={destinationRouteUpdate}
                            // onFocus={onFocusDestination}
                            id="destination-input"
                            className="controls"
                            type="text"
                            placeholder="ปลายทาง"
                            style={{
                                borderRadius: '8px',
                            }}
                        />

                        <div
                            id="mode-selector"
                            className="controls"
                            style={{
                                borderRadius: '8px',
                                marginRight: '10px',
                                display: 'none'
                            }}
                        >
                            <input type="radio" name="type" id="changemode-walking" />
                            <label htmlFor="changemode-walking">Walking</label>
                            <br />
                            <input type="radio" name="type" id="changemode-transit" />
                            <label htmlFor="changemode-transit">Transit</label>
                            <br />
                            <input type="radio" name="type" id="changemode-driving" checked="checked" />
                            <label htmlFor="changemode-driving">Driving</label>
                        </div>
                    </div>
                </Map>
                )
                : (<React.Fragment><Loading /></React.Fragment>)}
        </React.Fragment>
    );

};

PlaceAutocompleteAndDirections.propTypes = {
    isAuth: PropTypes.object,
    db: PropTypes.object
};

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(PlaceAutocompleteAndDirections);