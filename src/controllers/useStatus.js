import { useState, useEffect } from 'react';

function useStatus(props) {

  const [statusState, setState] = useState({
    isStatus: null
  });

  useEffect(() => {
    async function fetchData() {
      if (props.isUsersPrivate !== null) {
        // // console.log(props.isUsersPrivate.uid);
        let path = `status/${props.isUsersPrivate.uid}`

        const unsubscribe = await props.db.database().ref(`${path}`).once("value").then(function (snapshot) {
          let data = (snapshot.val())
          if (data !== null) {

            setState({ isStatus: data })
          } else {
            let statusData = {
              process: {
                share_id: '',
                uid: `${props.isUsersPrivate.uid}`,
                value: 'false'
              },
              share: {
                id: '',
                uid: `${props.isUsersPrivate.uid}`,
                value: 'false'
              },
              owner: {
                share_id: '',
                uid: `${props.isUsersPrivate.uid}`,
                value: 'false'
              },
              member: {
                share_id: '',
                uid: `${props.isUsersPrivate.uid}`,
                value: 'false'
              },
              alert: {
                share_id: '',
                uid: `${props.isUsersPrivate.uid}`,
                value: 'false'
              }
            }
            props.db.database().ref(`${path}`).update(statusData)
            setState({ isStatus: statusData })
          }
        })
        return unsubscribe;
      }
    }
    fetchData()
  }, [props]);
  return statusState;
}

export default useStatus;