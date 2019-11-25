import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import ConnectApiMaps, { Map } from 'maps-google-react';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { StyleBaseLine } from '../StyleBaseLine';
import ChatSlide from './components/ChatSlide';
import MemberTypeIconStatus from '../MemberModalTypeIconStatus';
import KeyDataTaxiCar from './components/KeyDataTaxiCar';
// import SearchBar from '../SearchBar';
// import SearchMap from '../SearchMap';
import { withRouter } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import MenuSlide from '../MenuSlide';
import ModelExitShare from './components/ModelExitShare';
import Loading from '../../../loading';
// import { useShare, useProfile, useUsers } from '../../../../controllers';

function useAlertStatus(props) {

    // console.time('ฉันคาดว่า 🤔 function useAlertStatus ใช้เวลาในการทำงานไป');

    const [updateAlertStatus, setState] = useState({
        isAlertStatus: null
    });

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useAlertStatus ใช้เวลาในการทำงานไป');

        async function update() {

            // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useAlertStatus => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {
                const unsubscribe = props.db.database().ref(`status/${props.isAuth.uid}/alert`).once("value").then(function (snapshot) {
                    let data = (snapshot.val());
                    // let stringifyData = JSON.stringify(data);

                    if (data !== null) {

                        setState({ isAlertStatus: data });

                    } else {

                        let statusData = {
                            share_id: '',
                            uid: `${props.isAuth.uid}`,
                            value: false
                        };

                        // console.time('ฉันคาดว่า 🤔 status => uid => alert ใช้เวลาในการ อัพเดต ไป');

                        props.db.database().ref(`status/${props.isAuth.uid}/alert`).update(statusData);

                        // console.timeEnd('ฉันคาดว่า 🤔 status => uid => alert ใช้เวลาในการ อัพเดต ไป');

                        setState({ isAlertStatus: statusData });

                    };

                });

                return unsubscribe;
            }

            // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useAlertStatus => function update ใช้เวลาในการทำงานไป');

        };

        update();

        // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useAlertStatus ใช้เวลาในการทำงานไป');

    });

    // console.timeEnd('ฉันคาดว่า 🤔 function useAlertStatus ใช้เวลาในการทำงานไป');

    return updateAlertStatus;

};

function useProfile(props) {

    // console.time('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    const [updateProfile, setState] = useState({
        isProfile: null
    })

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

        async function update() {

            // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

            if (props.isAuth !== null) {
                const unsubscribe = await props.db.firestore().collection('users').doc(props.isAuth.uid).get().then(function (doc) {

                    if (!doc.exists) {

                        // console.log('ข้อมูลโปรไฟล์ ใน database ไม่มี ฉันจะทำการ ฉันจะทำการสร้างข้อมูลโปรไฟล์ ใน database ให้ oK นะ 👌');

                        // console.time('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                        props.db.firestore().collection('users').doc(props.isAuth.uid).update({ profile: props.isAuth.providerData[0] })

                        // console.timeEnd('ฉันคาดว่า 🤔 users => uid => profile ใช้เวลาในการ อัพเดต ไป');

                        setState({ isProfile: props.isAuth.providerData[0] });

                    } else {

                        // console.log('ข้อมูลโปรไฟล์ ใน ฐานข้อมูล ✔');

                        setState({ isProfile: doc.data().profile });

                    }
                });

                return unsubscribe;

            };

            // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile => function update ใช้เวลาในการทำงานไป');

        };

        update();

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useProfile ใช้เวลาในการทำงานไป');

    }, [props]);

    // console.timeEnd('ฉันคาดว่า 🤔 function useProfile ใช้เวลาในการทำงานไป');

    return updateProfile;

};

function useShare(ref) {

    // console.time('ฉันคาดว่า 🤔 function useShare ใช้เวลาในการทำงานไป');

    const [updateShare, setState] = useState({
        isShare: null
    })

    useEffect(() => {

        // console.time('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare ใช้เวลาในการทำงานไป');
        return ref.then(function (doc) {

            if (!doc.exists) {

                // console.log('ไม่มีข้อมูลการแชร์เส้นทางเลย 😢');

                setState({ isShare: null });

            } else {

                // console.log('ฉันเจอคนที่แชร์เส้นทางแล้ว 👏');
                // console.log('share: ', doc.data());

                setState({ isShare: doc.data() });

            };

        });
        // console.timeEnd('ฉันคาดว่า 🤔 useEffect ที่อยู่ใน function useShare ใช้เวลาในการทำงานไป');

    }, []);

    // console.timeEnd('ฉันคาดว่า 🤔 function useShare ใช้เวลาในการทำงานไป');

    return updateShare;
};

const MemberStatus = (props) => {

    const [openChatSlide, setOpenChatSlide] = useState(false);
    const [openKeyDataTaxiCar, setOpenKeyDataTaxiCar] = useState(false);
    const [openMenuSlide, setOpenMenuSlide] = useState(false)
    const [openModelExitShare, setOpenModelExitShare] = useState(false)
    const [alertShare, setAlertShare] = useState({})
    const [isMap, setMap] = useState(null);
    const ref = props.db.firestore().collection(`share`).doc(props.isMemberStatus.share_id).get()
    const { isAlertStatus } = useAlertStatus(props);
    const { isProfile } = useProfile(props);
    const { isShare } = useShare(ref);


    const onChatSlide = () => {
        props.history.push(`chat/${props.isMemberStatus.share_id}`);
        window.location.reload();
        // setOpenChatSlide(true)
    }

    const offChatSlide = () => {
        setOpenChatSlide(false)
    }

    const onKeyDataTaxiCar = () => {
        if (isAlertStatus.value !== 'false') {
            setAlertShare(isShare.alert)
        } else {
            setAlertShare({
                uid: `${isAlertStatus.uid}`,
                share_id: `${isAlertStatus.share_id}`,
                select: 'กำลังรอข้อมูล',
                license_plate: 'กำลังรอข้อมูล'

            })
        }
        // })
        setOpenKeyDataTaxiCar(true)
    }

    const offKeyDataTaxiCar = () => {
        setOpenKeyDataTaxiCar(false)
    }

    const onMenuSlide = () => {
        setOpenMenuSlide(true)
    }

    const offMenuSlide = () => {
        setOpenMenuSlide(false)
    }

    const exitShareGroup = () => {
        setOpenModelExitShare(true)
    }

    const offModelExitShare = () => {
        setOpenModelExitShare(false)

    }


    const latlng = {
        lat: 14.012107100000001,
        lng: 100.7210703
    }

    const { classes } = props;

    return (
        <React.Fragment>
            {isProfile && isShare !== null
                ? (<React.Fragment>
                    <StyleBaseLine>
                        <Map
                            google={props.google}
                            mapOptions={
                                {
                                    zoom: 15,
                                    center: { lat: latlng.lat, lng: latlng.lat },
                                    disableDefaultUI: true,
                                    styles: [{
                                        featureType: 'poi.business',
                                        stylers: [{ visibility: 'on' }]
                                    },
                                    {
                                        featureType: 'transit',
                                        elementType: 'labels.icon',
                                        stylers: [{ visibility: 'off' }]
                                    }]
                                }}
                            opts={(google, map) => {

                                function CustomMarker(latlng, map, args, img) {
                                    this.latlng = latlng;
                                    this.args = args;
                                    this.img = img;
                                    this.setMap(map);
                                    this.maps = map
                                    setMap(map)
                                }

                                CustomMarker.prototype = new google.maps.OverlayView();

                                CustomMarker.prototype.onAdd = function () {
                                    var self = this;
                                    var div = this.div;
                                    if (!div) {
                                        // Generate marker html
                                        div = this.div = document.createElement('div');
                                        div.className = 'custom-marker';
                                        div.style.position = 'absolute';
                                        var innerDiv = document.createElement('div');
                                        innerDiv.className = 'custom-marker-inner';
                                        innerDiv.innerHTML = `<img  src="${this.img}" style="border-radius: inherit;width: 20px;height: 20px;margin: 2px;"/>`
                                        div.appendChild(innerDiv);

                                        if (typeof (self.args.marker_id) !== 'undefined') {
                                            div.dataset.marker_id = self.args.marker_id;
                                        }

                                        google.maps.event.addDomListener(div, "click", function (event) {
                                            google.maps.event.trigger(self, "click");
                                        });

                                        var panes = this.getPanes();
                                        panes.overlayImage.appendChild(div);
                                    }
                                };

                                CustomMarker.prototype.draw = function () {
                                    // มี bug icon ไม่เกาะ map
                                    if (this.div) {
                                        // กำหนด ตำแหน่ง ของhtml ที่สร้างไว้
                                        let positionA = new google.maps.LatLng(this.latlng.lat, this.latlng.lng);

                                        this.pos = this.getProjection().fromLatLngToDivPixel(positionA);
                                        // // console.log(this.pos);
                                        this.div.style.left = this.pos.x + 'px';
                                        this.div.style.top = this.pos.y + 'px';
                                    }
                                };

                                CustomMarker.prototype.getPosition = function () {
                                    return this.latlng;
                                };
                                function AutocompleteDirectionsHandler(google, map, data) {
                                    this.map = map;
                                    this.originPlaceId = null;
                                    this.destinationPlaceId = null;
                                    this.travelMode = 'WALKING';
                                    this.directionsService = new google.maps.DirectionsService;
                                    this.directionsRenderer = new google.maps.DirectionsRenderer;
                                    this.directionsRenderer.setMap(this.map);

                                    var me = this

                                    if (data === true) {
                                        me.setupPlaceChangedListener(data.request.origin.placeId, 'ORIG');
                                        me.setupPlaceChangedListener(data.request.destination.placeId, 'DEST');
                                        me.setupClickListener(data.request.travelMode);

                                    } else {
                                        me.setupPlaceChangedListener(data.request.origin.placeId, 'ORIG');
                                        me.setupPlaceChangedListener(data.request.destination.placeId, 'DEST');
                                        me.setupClickListener(data.request.travelMode);
                                    }
                                }

                                // Sets a listener on a radio button to change the filter type on Places
                                // Autocomplete.
                                AutocompleteDirectionsHandler.prototype.setupClickListener = function (mode) {
                                    var me = this;

                                    me.travelMode = mode;
                                    me.route();
                                };

                                AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (
                                    place, mode) {
                                    var me = this;

                                    // console.log(place);

                                    if (!place) {
                                        alert('Please select an option from the dropdown list.');
                                        return;
                                    }
                                    if (mode === 'ORIG') {
                                        me.originPlaceId = place;
                                    } else {
                                        me.destinationPlaceId = place;
                                    }
                                    me.route();
                                };

                                AutocompleteDirectionsHandler.prototype.route = function () {
                                    if (!this.originPlaceId || !this.destinationPlaceId) {
                                        return;
                                    }
                                    var me = this;

                                    this.directionsService.route(
                                        {
                                            origin: { 'placeId': this.originPlaceId },
                                            destination: { 'placeId': this.destinationPlaceId },
                                            travelMode: this.travelMode
                                        },
                                        function (response, status) {
                                            if (status === 'OK') {
                                                me.directionsRenderer.setDirections(response);
                                                // // console.log(response);

                                            } else {
                                                alert('Directions request failed due to ' + status);
                                                // // console.log(response, status);

                                            }
                                        });
                                };


                                var myLatlng = new google.maps.LatLng(props.isLocation.coords.latitude, props.isLocation.coords.longitude);
                                if (isProfile !== null) {
                                    var markerUser = new CustomMarker(
                                        myLatlng,
                                        map,
                                        {},
                                        isProfile.photoURL
                                    );
                                } else {
                                    window.location.reload()
                                }

                                var userPosistion = {
                                    lat: props.isLocation.coords.latitude,
                                    lng: props.isLocation.coords.longitude
                                };

                                markerUser.latlng = { lat: userPosistion.lat, lng: userPosistion.lng };
                                markerUser.draw();

                                map.setCenter(userPosistion);

                                Object.keys(isShare.member).map((key) => {
                                    if (key !== props.isAuth.uid) {
                                        props.db.database().ref(`users/${key}/location`).once("value").then(function (snapshot) {
                                            let data = (snapshot.val());

                                            var memberLatlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
                                            if (isShare.member !== null) {
                                                var markerMember = new CustomMarker(
                                                    memberLatlng,
                                                    map,
                                                    {},
                                                    isShare.member[key].photoURL
                                                );
                                            } else {
                                                window.location.reload()
                                            }

                                            var memberPosition = {
                                                lat: data.coords.latitude,
                                                lng: data.coords.longitude
                                            };

                                            markerMember.latlng = { lat: memberPosition.lat, lng: memberPosition.lng };
                                            markerMember.draw();

                                            map.setCenter(memberPosition);
                                        });
                                    }
                                })
                                // get.share.location(props.isStatus.owner.share_id).then(function (data) {
                                new AutocompleteDirectionsHandler(google, map, isShare.location);
                                // })
                                // })
                            }}
                        >

                            <Grid container style={{
                                width: 'min-content',
                                position: 'absolute',
                                top: '30px',
                                left: '5px'
                            }} >
                                <Fab size="medium" style={{ backgroundColor: '#274D7D', color: '#fff' }} onClick={onMenuSlide} aria-label="doc-taxi" className={classes.buttonTaxiDoc}>
                                    <MenuIcon />
                                </Fab>
                            </Grid>
                            <MemberTypeIconStatus isShare={isShare} />

                            <Grid container style={{
                                width: 'min-content',
                                position: 'absolute',
                                right: '15px',
                                bottom: '80px',

                            }} >
                                <Fab size="medium" style={{ backgroundColor: '#274D7D', color: '#fff' }} onClick={onKeyDataTaxiCar} aria-label="doc-taxi" className={classes.buttonTaxiDoc}>
                                    <AssignmentIcon />
                                </Fab>
                                <Fab size="medium" style={{ backgroundColor: '#274D7D', color: '#fff' }} onClick={onChatSlide} color="secondary" aria-label="add" className={classes.buttonChat}>
                                    <QuestionAnswerIcon />
                                </Fab>
                                <KeyDataTaxiCar {...alertShare} open={openKeyDataTaxiCar} onClose={offKeyDataTaxiCar} />
                            </Grid>
                            <Button variant="contained" onClick={exitShareGroup} style={{
                                backgroundColor: 'slategrey',
                                color: 'white'
                            }} className={classes.fab}>
                                ออกจากกลุ่ม
                        </Button>
                            <ModelExitShare
                                db={props.db}
                                isShare={isShare}
                                isMemberStatus={props.isMemberStatus}
                                open={openModelExitShare}
                                onClose={offModelExitShare}
                                isAuth={props.isAuth}
                            />

                        </Map>
                        <ChatSlide
                            open={openChatSlide}
                            onClose={offChatSlide}
                            isProfile={isProfile}
                            isMemberStatus={props.isMemberStatus}
                            db={props.db}
                        />
                        <MenuSlide
                            open={openMenuSlide}
                            onClose={offMenuSlide}
                            uid={props.isAuth.uid}
                            isProfile={isProfile}
                            db={props.db}
                        />
                    </StyleBaseLine>
                </React.Fragment>
                )
                : (<React.Fragment><Loading /></React.Fragment>)
            }
        </React.Fragment>
    )
}


const styles = {
    fab: {
        height: '45px',
        bottom: '16px',
        width: '-webkit-fill-available',
        position: 'absolute',
        marginLeft: '22px',
        marginRight: '22px',
        borderRadius: 12
    },
    buttonTaxiDoc: {
        margin: '5px',
        color: '#6d6d6d',
        backgroundColor: '#ffffff',
    },
    buttonChat: {
        margin: '5px',
        color: '#6d6d6d',
        backgroundColor: '#ffffff',
    }
}

MemberStatus.propTypes = {
    isAuth: PropTypes.object,
    isMemberStatus: PropTypes.object,
    db: PropTypes.object,
    isLocation: PropTypes.object,
}

export default ConnectApiMaps({
    apiKey: "AIzaSyBy2VY1e11qs-60Ul6aYT5klWYRI1K3RB0",
    libraries: ['places', 'geometry'],
})(withStyles(styles)(withRouter(MemberStatus)))