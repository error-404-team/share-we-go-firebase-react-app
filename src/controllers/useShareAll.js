import React, { useState, useEffect } from 'react';
// import { dateTime } from '../module';

const useShareAll = (props) => {
  const [shareAllState, setState] = useState({
    isShareAll: null
  });

  useEffect(() => {
    async function fetchData() {
        let path = `share`
        // let _log = `users/${user.uid}/_log/`

        const unsubscribe = await props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
          const data = (snapshot.val())

          setState({ isShareAll: data })

        })
        return unsubscribe;
    }
    fetchData();
  }, [props]);
  return shareAllState;
}

export default useShareAll;