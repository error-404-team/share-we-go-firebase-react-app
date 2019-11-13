import React, { useState, useEffect } from 'react';

const useShare = (props) => {
  const [shareState, setState] = useState({
    isShare: null
  });

  useEffect(() => {
    async function fetchData() {
      if (props.isUsersPrivate !== null) {
        let path = `share/${props.isUsersPrivate.uid}`;

        const unsubscribe = await props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
          let data = (snapshot.val())

          setState({ isShare: data })

        })
        return unsubscribe;
      }
    }
    fetchData();
  }, [props]);
  return shareState;
}

export default useShare;