import React, { useState, useEffect } from 'react';

const useStatusAll = (props) => {
  const [statusAllState, setState] = useState({
    isStatusAll: null
  });

  useEffect(() => {
    let path = `status`
    // let _log = `users/${user.uid}/_log/`

    const unsubscribe = props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
      let data = (snapshot.val())

      setState({ isStatusAll: data })

    })
    return unsubscribe;
  }, [props]);
  return statusAllState;
}

export default useStatusAll;