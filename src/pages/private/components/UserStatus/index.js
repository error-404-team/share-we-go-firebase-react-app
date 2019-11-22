import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// import { Link } from 'react-router-dom';

// import ConnectApiMaps, { Map } from 'maps-google-react';
// import $ from 'jquery';

// import Button from '@material-ui/core/Button';

// import AddIcon from '@material-ui/icons/Add';

import { StyleBaseLine } from '../StyleBaseLine';

import { VisibilityButton } from '../VisibilityButton';
// import SearchBar from '../SearchBar';
// import SearchMap from '../SearchMap';
import MenuSlide from '../MenuSlide';

import './styles/marker-custom.css';
// import { useUsers, useShareAll, useShare, useStatusAll } from '../../../../controllers';
// import { dateTime } from '../../../../model/dateTime';
import Loading from '../../../loading';
import ModelAlertNotShare from './components/ModelAlertNotShare';
import MapOffShare from './components/MapOffShare';
import MapOnShare from './components/MapOnShare';

function useProfile(props) {

    console.time('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    const [updateProfile, setState] = useState({
        isProfile: null
    })

    useEffect(() => {

        console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

        async function update() {

            console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {
                const unsubscribe = await props.db.firestore().collection('users').doc(props.isAuth.uid).get().then(function (doc) {

                    if (!doc.exists) {

                        console.log('ข้อมูลโปรไฟล์ ใน database ไม่มี ฉันจะทำการ ฉันจะทำการสร้างข้อมูลโปรไฟล์ ใน database ให้ oK นะ 👌');

                        console.time('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                        props.db.firestore().collection('users').doc(props.isAuth.uid).update({ profile: props.isAuth.providerData[0] })

                        console.timeEnd('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                        setState({ isProfile: props.isAuth.providerData[0] });

                    } else {

                        console.log('ข้อมูลโปรไฟล์ ใน ฐานข้อมูล ✔');
                        if (doc.data().profile !== null) {

                            setState({ isProfile: doc.data().profile });

                        } else {

                            console.time('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                            props.db.firestore().collection('users').doc(props.isAuth.uid).update({ profile: props.isAuth.providerData[0] })

                            console.timeEnd('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                            setState({ isProfile: props.isAuth.providerData[0] });


                        }

                    }
                });

                return unsubscribe;

            };

            console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

        };

        update();

        console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

    }, [props]);

    console.timeEnd('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    return updateProfile;

};

function useShare(props) {

    console.time('ฉันคาดว่า 🤔 function useShare ใช้เวลาในการทำงานไป');

    const [updateShare, setState] = useState({
        isShare: null
    })

    useEffect(() => {

        console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare ใช้เวลาในการทำงานไป');

        async function update() {

            console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {

                const unsubscribe = await props.db.firestore().collection(`share`).get().then(function (querySnapshot) {

                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());

                        if (doc.data().status.value === true) {

                            setState({ isShare: { [doc.id]: doc.data() } });
                        }
                    });

                    // if (!doc.exists) {

                    //     console.log('ไม่มีข้อมูลการแชร์เส้นทางเลย 😢');

                    //     setState({ isShare: null });

                    // } else {

                    //     console.log('ฉันเจอคนที่แชร์เส้นทางแล้ว 👏');

                    //     setState({ isShare: doc.data() });

                    // }
                });

                return unsubscribe;

            }

            console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare => function update ใช้เวลาในการทำงานไป');

        };

        update();

        console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare ใช้เวลาในการทำงานไป');

    }, [props]);

    console.timeEnd('ฉันคาดว่า 🤔 function useShare ใช้เวลาในการทำงานไป');

    return updateShare;

};

const MapShareStatusVisibility = (props) => {

    return (
        <React.Fragment>
            {props.open !== true
                ? (<React.Fragment>
                    <MapOffShare
                        isProfile={props.isProfile}
                        visibility={props.visibility}
                        openMenuSlide={props.openMenuSlide}
                        isLocation={props.isLocation}
                    />
                </React.Fragment>)
                : (<React.Fragment>
                    <MapOnShare
                        isProfile={props.isProfile}
                        isShare={props.isShare}
                        visibility={props.visibility}
                        openMenuSlide={props.openMenuSlide}
                        isLocation={props.isLocation}
                        db={props.db}
                        isAuth={props.isAuth}
                    />
                </React.Fragment>)}
        </React.Fragment>
    )

};

MapShareStatusVisibility.propTypes = {
    open: PropTypes.bool,
    isProfile: PropTypes.object,
    visibility: PropTypes.element,
    isShare: PropTypes.object,
    openMenuSlide: PropTypes.func,
    isLocation: PropTypes.object,
    db: PropTypes.object,
    isAuth: PropTypes.object
};

const UserStatus = (props) => {

    const [openVisibility, setOpenVisibility] = useState(false);
    const [openMenuSlide, setOpenMenuSlide] = useState(false);
    const [openModelJoinShare, setOpenModelJoinShare] = useState({
        key: '',
        bool: false
    });
    const [showMapShare, setShowMapShare] = useState(false);
    const [alertMapNotShare, setAlertMapNotShare] = useState(false);
    // const [isProfile, setProfile] = useState(null);
    // const [isShare, setShare] = useState(null);

    // const { isUsers } = useUsers(props)
    const { isProfile } = useProfile(props);
    const { isShare } = useShare(props);
    // const { isStatusAll } = useStatusAll(props);

    useEffect(() => {

        if (isShare !== null) {

            setShowMapShare(true);

        };

    });

    const onVisibility = () => {

        if (showMapShare !== true) {

            setAlertMapNotShare(true);

        } else {

            setOpenVisibility(false);



        };

    };

    const offVisibility = () => {
        console.log('aa');
        setOpenVisibility(true);

    };

    const onMenuSlide = () => {

        setOpenMenuSlide(true);

    };

    const offMenuSlide = () => {

        setOpenMenuSlide(false);

    };

    const offAlertMapNotShare = () => {

        setAlertMapNotShare(false);

    };

    const onModelJoinShare = (key) => {

        console.time('ฉันคาดว่า 🤔 status => uid => member ใช้เวลาในการ อัพเดต ไป');

        props.db.database().ref(`status/${props.isAuth.uid}/member`).update({
            share_id: key,
            uid: props.isAuth.uid,
            value: true
        }).then(() => {

            console.log('อัพเดต status => key => member => uid เสร็จสิ้น ✔');

        });

        console.timeEnd('ฉันคาดว่า 🤔 status => uid => member ใช้เวลาในการ อัพเดต ไป');
        console.time('ฉันคาดว่า 🤔 share => key => member => uid ใช้เวลาในการ อัพเดต ไป');

        props.db.firestore().collection(`share`).doc(key).update({
            member: {
                [props.isAuth.uid]: {
                    share_id: key,
                    uid: props.isAuth.uid,
                    photoURL: isProfile.photoURL,
                    displayName: isProfile.displayName
                }
            }
        }).then(() => {

            console.log('อัพเดต share => key => member => uid เสร็จสิ้น ✔');

            window.location.reload();

        });

        console.timeEnd('ฉันคาดว่า 🤔 share => key => member => uid ใช้เวลาในการ อัพเดต ไป');

        //  ({
        //     key: `${key}`,
        //     bool: true
        // });


    };

    const offModelJoinShare = () => {
        setOpenModelJoinShare({
            key: '',
            bool: false
        });
    };


    // console.log(isUsers);

    // const MapSearch = MapSearch
    // const UserMarker = UserMarker
    return (
        <Fragment>
            <StyleBaseLine>
                {isProfile !== null
                    ? (
                        <React.Fragment>
                            <MapShareStatusVisibility
                                open={openVisibility}
                                isProfile={isProfile}
                                isShare={isShare}
                                openMenuSlide={onMenuSlide}
                                isAuth={props.isAuth}
                                isLocation={props.isLocation}
                                db={props.db}
                            />
                            <VisibilityButton open={openVisibility} on={onVisibility} off={offVisibility} />
                        </React.Fragment>
                    )
                    : (<React.Fragment><Loading /></React.Fragment>)
                }
                <MenuSlide
                    db={props.db}
                    open={openMenuSlide}
                    onClose={offMenuSlide}
                    isProfile={isProfile}
                    uid={props.isAuth.uid}
                />
                <ModelAlertNotShare
                    open={alertMapNotShare}
                    onClose={offAlertMapNotShare}
                />
            </StyleBaseLine>
        </Fragment>
    )

}

UserStatus.propTypes = {
    isAuth: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object,
}



export default UserStatus;