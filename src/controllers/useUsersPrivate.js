import { useState, useEffect } from 'react';
import { dateTime } from '../model/dateTime';
import PropTypes from 'prop-types';

const useUsersPrivate = (props) => {
  const [usersPrivateState, setState] = useState({
    isUsersPrivate: null
  });

  useEffect(() => {
    const unsubscribe = props.db.auth().onAuthStateChanged((user) => {

      let path = `users/${user.uid}/user`
      let _log = `users/${user.uid}/_log/user`

      let stringifyData = JSON.stringify(user)
      let stringifyDataLog = JSON.stringify(
        {
          date: dateTime,
          user: user
        }
      )

      props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
        let data = (snapshot.val())
        if (data !== null) {

          setState({ isUsersPrivate: data })
        }
        else {
          props.db.database().ref(`${path}`).update(JSON.parse(stringifyData))
          props.db.database().ref(`${_log}`).push(JSON.parse(stringifyDataLog))
          setState({ isUsersPrivate: JSON.parse(stringifyData) })
        }
      })
    })
    return unsubscribe;
  }, [props]);
  return usersPrivateState;
}

useUsersPrivate.propTypes = {

}

export default useUsersPrivate;