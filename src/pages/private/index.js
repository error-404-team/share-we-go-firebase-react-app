import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UserStatus from './components/UserStatus';
import MemberStatus from './components/MemberStatus';
import OwnerStatus from './components/OwnerStatus';
import Loading from '../loading';
// import { useStatus } from '../../controllers';

function useOwnerStatus(props) {
    const [updateOwnerStatus, setState] = useState({
        isOwnerStatus: null
    })

    useEffect(() => {
        async function update() {

            if (props.isAuth !== null) {
                const unsubscribe = await props.db.database().ref(`status/${props.isAuth.uid}/owner`).once("value").then(function (snapshot) {
                    let data = (snapshot.val());
                    // let stringifyData = JSON.stringify(data);

                    if (data !== null) {
                        console.log('สถานะ owner ใน ฐานข้อมูล ✔');

                        setState({ isOwnerStatus: data })
                    } else {
                        console.log('ไม่มีข้อมูล สถานะ owner ใน ฐานข้อมูล ฉันจะทำการสร้างมันใหม่ k นะ 👍');
                        let statusData = {
                            share_id: '',
                            uid: `${props.isAuth.uid}`,
                            value: false

                        }

                        props.db.database().ref(`status/${props.isAuth.uid}/owner`).update(statusData)

                        setState({ isOwnerStatus: statusData })
                    }
                });
                return unsubscribe;
            }
        }
        update();
    }, [props]);
    return updateOwnerStatus;
}

function useMemberStatus(props) {
    const [updateMemberStatus, setState] = useState({
        isMemberStatus: null
    })


    useEffect(() => {
        async function update() {
            if (props.isAuth !== null) {

                const unsubscribe = props.db.database().ref(`status/${props.isAuth.uid}/member`).once("value").then(function (snapshot) {
                    let data = (snapshot.val())

                    if (data !== null) {
                        console.log('สถานะ member ใน ฐานข้อมูล ✔');

                        setState({ isMemberStatus: data })
                    } else {
                        console.log('ไม่มีข้อมูล สถานะ member ใน ฐานข้อมูล ฉันจะทำการสร้างมันใหม่ k นะ 👍');

                        let statusData = {
                            share_id: '',
                            uid: `${props.isAuth.uid}`,
                            value: false

                        }

                        props.db.database().ref(`status/${props.isAuth.uid}/member`).update(statusData)

                        setState({ isMemberStatus: statusData })
                    }
                });
                return unsubscribe;
            }
        }
        update();
    }, [props]);
    return updateMemberStatus;
}

const Private = (props) => {
    const [isLocation, setLocation] = useState(null);
    const { isMemberStatus } = useMemberStatus(props);
    const { isOwnerStatus } = useOwnerStatus(props);

    useEffect(() => {
        if (props.isAuth !== null) {

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

                    props.db.database().ref(`users/${props.isAuth.uid}/location`).update(locationData)
                    setLocation(locationData)
                })
            }
        }
    });

    return (
        <React.Fragment>
            {isOwnerStatus && isMemberStatus && isLocation !== null
                ? (<React.Fragment>
                    {isOwnerStatus.value !== false
                        ? (<React.Fragment>
                            <OwnerStatus
                                db={props.db}
                                isAuth={props.isAuth}
                                isLocation={isLocation}
                            />
                            {/* test */}
                        </React.Fragment>)
                        : (<React.Fragment>
                            {isMemberStatus.value !== false
                                ? (
                                    <React.Fragment>
                                        <MemberStatus
                                            db={props.db}
                                            isAuth={props.isAuth}
                                            isMemberStatus={isMemberStatus}
                                            isLocation={isLocation}
                                        />
                                    </React.Fragment>)
                                : (<React.Fragment>
                                    <UserStatus
                                        db={props.db}
                                        isAuth={props.isAuth}
                                        isLocation={isLocation}
                                    />
                                    {/* คาดว่าน่าจะ error ตรงนี้แหละ */}
                                </React.Fragment>)
                            }
                        </React.Fragment>)
                    }
                </React.Fragment>)
                : (<React.Fragment>
                    <Loading />
                </React.Fragment>)
            }
        </React.Fragment>
    )
}

Private.propType = {
    isAuth: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object
}

export default Private;