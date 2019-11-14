import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { dateTime } from '../model/dateTime';

const useProfile = (props) => {
  const [profileState, setState] = useState({
    isProfile: null
  });

  useEffect(() => {
    async function fetchData() {
      if (props.isUsersPrivate !== null) {
        console.log(props.isUsersPrivate.uid);

        // const pathUser = `users/${props.isUsersPrivate.uid}/user`
        const pathProfile = `users/${props.isUsersPrivate.uid}/profile`;
        const pathProfileLog = `users/${props.isUsersPrivate.uid}/_log/profile`;

        const unsubscribe = await props.db.database().ref(`${pathProfile}`).once("value").then(function (snapshot) {
          const data = (snapshot.val())
          if (data !== null) {
            // console.log((snapshot.val()));

            setState({isProfile: data})
          } else {

            let privateData = JSON.stringify(props.isUsersPrivate.providerData[0])

            props.db.database().ref(`${pathProfile}`).update(JSON.parse(privateData))
            props.db.database().ref(`${pathProfileLog}`).push({
              date: dateTime,
              profile: JSON.parse(privateData)
            })
          }
        })
        return unsubscribe;
      }
    }
    fetchData(props);
  }, [props]);
  return profileState;
}

useProfile.propTypes = {
  isUsersPrivate: PropTypes.object,
  db: PropTypes.object
}

export default useProfile;