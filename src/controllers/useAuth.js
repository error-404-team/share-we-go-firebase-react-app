import React, { useState, useEffect } from 'react';

const useAuth = (props) => {
  const [updateAuth, setState] = useState({
    isLoading: true,
    isAuth: null
  });

  useEffect(() => {
    const unsubscribe = props.db.auth().onAuthStateChanged((user) => {
      let stringifyData = JSON.stringify(user)
      props.db.firestore().collection('users').doc(user.uid).update({ auth: JSON.parse(stringifyData) });

      setState({ isLoading: false, isAuth: user });
    });
    return unsubscribe;
  }, [props]);
  return updateAuth;
}


export default useAuth;