import React from 'react';
// import $ from 'jquery.cookie'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types';

function GeoError(props) {

    function geoAllow() {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          
          function success(pos) {
            var crd = pos.coords;
          
            // console.log('Your current position is:');
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            // console.log(`More or less ${crd.accuracy} meters.`);
          }
          
          function error(err) {
            // console.warn(`ERROR(${err.code}): ${err.message}`);
          }
          
          navigator.geolocation.getCurrentPosition(success, error, options);
        // $("#geo-helper").show();
        // if (!$.cookie("geoperm")) {
        //     $("#geo-helper").show();
        // }
        // $.cookie("geoperm", "true")
        // Cookies.set("geoperm", "true")
        // console.log(Cookies.get("geoperm"));
        
        // positionOptions.enableHighAccuracy = true;
        // positionOptions.maximumAge = 0;
        // positionOptions.timeout = 1000;
        // window.location.reload();
    }
    return (
        <React.Fragment>
            <center style={{
                marginTop: ((window.innerHeight / 2) - 20)
            }}>
                <p>{props.error}</p>
                <button onClick={geoAllow}>Allow Geolocation</button>
            </center>
        </React.Fragment>
    )
}

GeoError.propTypes = {
    firebase: PropTypes.object,
    error: PropTypes.string
}

export default GeoError;