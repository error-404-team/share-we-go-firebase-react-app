import React, { useState, useEffect } from 'react';

const useHistory = (props) => {
  const [historyState, setState] = useState({
    isHistory: null
  });

  useEffect(() => {
    async function fetchData() {
      if (props.isUsersPrivate !== null) {
        let path = `history/${props.isUsersPrivate.uid}`

        const unsubscribe = props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
          let data = (snapshot.val())

          setState({ isHistory: data })

        })
        return unsubscribe;
      }
    }
    fetchData();
  }, [props]);
  return historyState;
}

export default useHistory;