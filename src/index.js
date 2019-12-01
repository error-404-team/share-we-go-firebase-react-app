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
    apiKey: "AIzaSyAU9ngoZrzye3ak8eiI5Oz3O_R_JqoRix0",
    authDomain: "swg-users-bata-test.firebaseapp.com",
    databaseURL: "https://swg-users-bata-test.firebaseio.com",
    projectId: "swg-users-bata-test",
    storageBucket: "swg-users-bata-test.appspot.com",
    messagingSenderId: "685921240361",
    appId: "1:685921240361:web:8d0d633019fb02e7b82338",
    measurementId: "G-YK1YFRRBEQ"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.addEventListener('appinstalled', (evt) => {
    evt.preventDefault();
    // console.log('a2hs installed');
});

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    ReactDOM.render(<GeoError db={firebase} error="Geolocation is not supported" />, document.getElementById('root'));
    // console.log("Geolocation is not supported by this browser.");
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
