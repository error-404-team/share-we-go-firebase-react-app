import React, { useState, useEffect } from 'react';

const useAuth = (props) => {
  const [authState, setState] = useState({
    isLoading: true,
    isAuth: null
  });

  useEffect(() => {
    const unsubscribe = props.db.auth().onAuthStateChanged((user) =>
      setState({ isLoading: false, isAuth: user })
    );
    return unsubscribe;
  }, [props]);
  return authState;
}


export default useAuth;