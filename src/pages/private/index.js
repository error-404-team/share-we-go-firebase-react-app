import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UserStatus from './components/UserStatus';
import MemberStatus from './components/MemberStatus';
import OwnerStatus from './components/OwnerStatus';
import Loading from '../loading';
// import { useStatus } from '../../controllers';

function useOwnerStatus(props) {

    console.time('ฉันคาดว่า 🤔 function useOwnerStatus ใช้เวลาในการทำงานไป');

    const [updateOwnerStatus, setState] = useState({
        isOwnerStatus: null
    })

    useEffect(() => {

        console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useOwnerStatus ใช้เวลาในการทำงานไป');

        async function update() {

            console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useOwnerStatus => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {

                const unsubscribe = await props.db.database().ref(`status/${props.isAuth.uid}/owner`).once("value").then(function (snapshot) {

                    let data = (snapshot.val());
                    // let stringifyData = JSON.stringify(data);

                    if (data !== null) {

                        console.log("ฉันได้ทำการเชคข้อมูล status => uid => owner ok! 😮 มีข้อมูล status อยู่ในฐานข้อมูล: ", data);

                        setState({ isOwnerStatus: data });

                    } else {

                        console.log('ไม่มีข้อมูล สถานะ owner ใน ฐานข้อมูล ฉันจะทำการสร้างมันใหม่ k นะ 👍');

                        let statusData = {
                            share_id: '',
                            uid: `${props.isAuth.uid}`,
                            value: false
                        };

                        console.time('ฉันคาดว่า 🤔 ใช้เวลาในการสร้าง ฐานข้อมูล status => uid => owner ไป');
                        // <--(
                        props.db.database().ref(`status/${props.isAuth.uid}/owner`).update(statusData);
                        // )-->
                        console.timeEnd('ฉันคาดว่า 🤔 ใช้เวลาในการสร้าง ฐานข้อมูล status => uid => owner ไป');

                        setState({ isOwnerStatus: statusData });
                    }

                    console.log('สถานะ owner ใน ฐานข้อมูล ✔');

                });

                return unsubscribe;
            };

            console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useOwnerStatus => function update ใช้เวลาในการทำงานไป');

        };

        update();

        console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useOwnerStatus ใช้เวลาในการทำงานไป');

    }, [props]);

    console.timeEnd('ฉันคาดว่า 🤔 function useOwnerStatus ใช้เวลาในการทำงานไป');

    return updateOwnerStatus;

}

function useMemberStatus(props) {

    console.time('ฉันคาดว่า 🤔 function useMemberStatus ใช้เวลาในการทำงานไป');

    const [updateMemberStatus, setState] = useState({
        isMemberStatus: null
    })


    useEffect(() => {

        console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useMemberStatus ใช้เวลาในการทำงานไป');

        async function update() {

            console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useMemberStatus => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {

                const unsubscribe = props.db.database().ref(`status/${props.isAuth.uid}/member`).once("value").then(function (snapshot) {

                    let data = (snapshot.val())

                    if (data !== null) {

                        console.log("ฉันได้ทำการเชคข้อมูล status => uid => member ok! 😮 มีข้อมูล status อยู่ในฐานข้อมูล: ", data);

                        setState({ isMemberStatus: data });

                    } else {

                        console.log('ไม่มีข้อมูล สถานะ member ใน ฐานข้อมูล ฉันจะทำการสร้างมันใหม่ k นะ 👍');

                        let statusData = {
                            share_id: '',
                            uid: `${props.isAuth.uid}`,
                            value: false

                        }

                        console.time('ฉันคาดว่า 🤔 ใช้เวลาในการสร้าง ฐานข้อมูล status => uid => member ไป');
                        // <--(
                        props.db.database().ref(`status/${props.isAuth.uid}/member`).update(statusData);
                        // )-->
                        console.timeEnd('ฉันคาดว่า 🤔 ใช้เวลาในการสร้าง ฐานข้อมูล status => uid => member ไป');

                        setState({ isMemberStatus: statusData })
                    };

                    console.log('สถานะ member ใน ฐานข้อมูล ✔');

                });
                return unsubscribe;
            };

            console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useMemberStatus => function update ใช้เวลาในการทำงานไป');

        };

        update();

        console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useMemberStatus ใช้เวลาในการทำงานไป');

    }, [props]);

    console.timeEnd('ฉันคาดว่า 🤔 function useMemberStatus ใช้เวลาในการทำงานไป');

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