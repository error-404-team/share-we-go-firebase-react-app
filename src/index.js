import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
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


ReactDOM.render(<App db={firebase} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
