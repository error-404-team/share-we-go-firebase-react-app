import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { dateTime } from '../model/dateTime';

const useLocation = (props) => {
  const [locationState, setState] = useState({
    isLocation: null
  });

  useEffect(() => {
    const unsubscribe = props.db.auth().onAuthStateChanged((user) => {
      let path = `users/${user.uid}/location`
      let _log = `users/${user.uid}/_log/location`

      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
          let locationData = {
            coords: {
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed,
            },
            timestamp: position.timestamp
          }

          props.db.database().ref(`${path}`).update(locationData)
          // props.db.database().ref(`${_log}`).push({
          //   date: dateTime,
          //   location: locationData
          // })

          setState({ isLocation: locationData })
        })
      }

      
    })
    return unsubscribe;
  }, [props]);
  return locationState;
}

useLocation.propTypes = {
  db: PropTypes.object
}

export default useLocation;