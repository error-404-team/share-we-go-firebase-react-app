import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import ContaiterBackGround from './components/ContaiterBackGround';
import logo from './img/logo.png';

function SignInScreen(props) {

  
  const uiConfig = {
   
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      props.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      props.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      { 
        provider: props.firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image',
          size: 'normal',
          badge: 'bottomleft'
        },
        defaultCountry: 'TH',
        whitelistedCountries:['TH', '+66']
      }
    ]
  };

  return (
    <ContaiterBackGround backgroundColor="#274D7D" height="100vh">
      <div style={{
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#274D7D',
        alignItems: 'center',
      }}>
        <img src={logo} style={{
          margin: 10,
          width: 200
        }} alt="true" />
        <h1 style={{ color: 'white' }}>Share We Go App</h1>
        <p style={{ color: 'white' }}>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={props.firebase.auth()} />
      </div>
    </ContaiterBackGround>
  );

}

export default SignInScreen