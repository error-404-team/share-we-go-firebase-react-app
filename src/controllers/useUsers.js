import React, { useState, useEffect } from 'react';
// import { dateTime } from '../module';

const useUsers = (props) => {
  const [usersState, setState] = useState({
    isUsers: null
  });

  useEffect(() => {
    async function fetchData() {
      if (props.isUsersPrivate !== null) {
        let path = `users/${props.isUsersPrivate.uid}`

        const unsubscribe = await props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
          let data = (snapshot.val())

          setState({ isUsers: data })

        })
        return unsubscribe;
      }
    }
    fetchData();
  }, [props]);
  return usersState;
}


export default useUsers;