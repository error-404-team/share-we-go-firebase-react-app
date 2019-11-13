import React, { useState, useEffect } from 'react';
import { dateTime } from '../model/dateTime';

const useProfile = (props) => {
  const [userState, setState] = useState({
    isProfile: null
  });

  useEffect(() => {
    async function fetchData() {
      if (props.isUsersPrivate !== null) {
        let pathUser = `users/${props.isUsersPrivate.uid}/user`
        let pathProfile = `users/${props.isUsersPrivate.uid}/profile`;
        let pathProfileLog = `users/${props.isUsersPrivate.uid}/_log/profile`;

        const unsubscribe = await props.db.database().ref(`${pathProfile}`).once("value").then(function (snapshot) {
          let data = (snapshot.val())
          if (data !== null) {

            setState({ isProfile: data })
          } else {
            props.db.database().ref(`${pathUser}`).once("value").then(function (snapshot) {
              let user = (snapshot.val())

              props.db.database().ref(`${pathProfile}`).update(user.providerData[0])
              props.db.database().ref(`${pathProfileLog}`).push({
                date: dateTime,
                location: user.providerData[0]
              })
            })
          }
        })
        return unsubscribe;
      }
    }
    fetchData();
  }, [props]);
  return userState;
}

export default useProfile;