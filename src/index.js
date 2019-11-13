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
    apiKey: "AIzaSyCe5WE0chj6pwyUd82JfvNKkiv9YW5U45k",
    authDomain: "share-we-go-app.firebaseapp.com",
    databaseURL: "https://share-we-go-app.firebaseio.com",
    projectId: "share-we-go-app",
    storageBucket: "share-we-go-app.appspot.com",
    messagingSenderId: "323869691396",
    appId: "1:323869691396:web:a0471adc525dc674b12f51",
    measurementId: "G-RP811B1PKK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


ReactDOM.render(<App db={firebase} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
