import React, { useState, useEffect } from 'react';

const useHistory = (props) => {
  const [historyState, setState] = useState({
    isHistory: null
  });

  useEffect(() => {
    let path = `history/${props.user.uid}`

    const unsubscribe = props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
      let data = (snapshot.val())

      setState({ isHistory: data })

    })
    return unsubscribe;
  }, [props]);
  return historyState;
}

export default useHistory;