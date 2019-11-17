import React, { useState, useEffect } from 'react';

const useStatusAll = (props) => {
  const [statusAllState, setState] = useState({
    isStatusAll: null
  });

  useEffect(() => {
    async function fetchData() {
    let path = `status`
    // let _log = `users/${user.uid}/_log/`

    const unsubscribe = await props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
      let data = (snapshot.val())

      setState({ isStatusAll: data })

    })
    return unsubscribe;
  }
  fetchData();
  }, [props]);
  return statusAllState;
}

export default useStatusAll;