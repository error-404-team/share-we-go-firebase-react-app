import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GeoError from './GeoError';
// import NotSupported from './NotSupported';
import * as serviceWorker from './serviceWorker';
// import * as admin from "firebase-admin";
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1F6O_Obk0xkqbN_0_tLOlz9L2US0yWQo",
    authDomain: "swg-dev-test.firebaseapp.com",
    databaseURL: "https://swg-dev-test.firebaseio.com",
    projectId: "swg-dev-test",
    storageBucket: "swg-dev-test.appspot.com",
    messagingSenderId: "712121508420",
    appId: "1:712121508420:web:04966f8bd2c813046a9211",
    measurementId: "G-7PVYKPJW62"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.addEventListener('appinstalled', (evt) => {
    evt.preventDefault();
    console.log('a2hs installed');
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, showError);
} else {
    ReactDOM.render(<GeoError db={firebase} error="Geolocation is not supported" />, document.getElementById('root'));
    console.log("Geolocation is not supported by this browser.");
}

function showPosition(position) {
    let pos = {
        coords: {
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed,
        },
        timestamp: position.timestamp
    }

    return ReactDOM.render(<App db={firebase} position={pos} />, document.getElementById('root'));
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
