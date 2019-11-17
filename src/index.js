import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GeoError from './GeoError';
// import NotSupported from './NotSupported';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA77no0xwPQBpR5vmWCb1CHn4ofCaAmwj4",
    authDomain: "test-projeck-share-we-go.firebaseapp.com",
    databaseURL: "https://test-projeck-share-we-go.firebaseio.com",
    projectId: "test-projeck-share-we-go",
    storageBucket: "test-projeck-share-we-go.appspot.com",
    messagingSenderId: "159987611648",
    appId: "1:159987611648:web:e472c7802c41ac574c40e5",
    measurementId: "G-NEQZ0L0PEV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.addEventListener('appinstalled', (evt) => {
    evt.preventDefault();
    console.log('a2hs installed');
  });

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    ReactDOM.render(<GeoError db={firebase} error="Geolocation is not supported" />, document.getElementById('root'));
    console.log("Geolocation is not supported by this browser.");
}

function showPosition(position) {

    return ReactDOM.render(<App db={firebase} />, document.getElementById('root'));
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            ReactDOM.render(<GeoError db={firebase} error="User denied the request for Geolocation." />, document.getElementById('root'));
            break;
        case error.POSITION_UNAVAILABLE:
            ReactDOM.render(<GeoError db={firebase} error="Location information is unavailable." />, document.getElementById('root'));
            break;
        case error.TIMEOUT:
            ReactDOM.render(<GeoError db={firebase} error="The request to get user location timed out." />, document.getElementById('root'));
            break;
        case error.UNKNOWN_ERROR:
            ReactDOM.render(<GeoError db={firebase} error="An unknown error occurred." />, document.getElementById('root'));
            break;
    }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
